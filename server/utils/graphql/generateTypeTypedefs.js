const S = require('string');
const mongoose = require('mongoose');

const generateTypeStr = require('./generateTypeStr');

function populateObjDefaultValue(obj, fields) {
	Object.entries(fields).forEach(([ key, value ]) => {
		if (obj[key] === undefined) obj[key] = value;
	});
}

module.exports = function(resource, baseSchema, Validators) {
	const capitalizedResource = S(resource).capitalize().s;

	function parseScalarType(value, { mongql }, path) {
		const isArray = Array.isArray(value);
		const target = isArray ? value[0] : value;
		let type = null;
		if (mongql.scalar) {
			type = mongql.scalar;
			baseSchema.path(path).validate((v) => {
				const value = Validators[type](v);
				return value !== null && value !== undefined;
			}, (props) => props.reason.message);
		} else if (Array.isArray(target.type)) {
			if (Array.isArray(target.type[0])) type = `[${target.type[0][0].name}]`;
			else type = target.type[0].name;
		} else if (target.type) type = target.type.name;
		else type = target.name;

		if (type.match(/(Int32|Number)/)) type = 'Int';
		else if (type === 'Double') type = 'Float';

		if (type === 'ObjectId') type = 'ID';
		type = isArray || Array.isArray(value.type) ? `[${type}${mongql.type[1] ? '!' : ''}]` : type;
		return type;
	}

	const {
		global_inputs,
		global_excludePartitions,
		generateInterface,
		appendRTypeToEmbedTypesKey
	} = baseSchema.mongql.global_configs;

	const inputs = {};
	const enums = {};
	const types = {};
	const fields = {};
	const interfaces = {};
	if (generateInterface) {
		interfaces[capitalizedResource] = {
			id: {
				value: 'ID!'
			}
		};
	}
	if (global_inputs.base) inputs[capitalizedResource + 'Input'] = {};
	if (global_excludePartitions.base !== true) {
		types.base = {};
		[ 'Mixed', 'Others', 'Self' ].forEach((part) => {
			if (!global_excludePartitions.base.includes(part))
				types.base[`${part}${capitalizedResource}Type`] = {
					id: {
						value: 'ID!',
						variant: 'ID'
					}
				};
		});
	} else
		types.base = {
			[capitalizedResource]: {}
		};
	types.extra = {};

	// ? Combine base and extra type functions
	function populateBaseTypes(key, value, { variant, baseType = null, mongql, isArray }) {
		const { excludePartitions, partitionMapper } = mongql;
		function populate(part) {
			let new_value =
				global_excludePartitions.base !== true && excludePartitions !== true && variant.match(/(ref)/)
					? partitionMapper[part] + value
					: value;
			if (isArray) new_value = '[' + new_value.replace('[', '');
			types.base[`${global_excludePartitions.base ? part : ''}${capitalizedResource}Type`][key] = {
				value: new_value,
				variant,
				baseType,
				excludePartitions
			};
		}

		if (Array.isArray(excludePartitions)) {
			if (!global_excludePartitions.base.includes('Mixed') && !excludePartitions.includes('Mixed')) populate('Mixed');
			if (!global_excludePartitions.base.includes('Others') && !excludePartitions.includes('Others'))
				populate('Others');
			if (!global_excludePartitions.base.includes('Self') && !excludePartitions.includes('Self')) populate('Self');
		}

		if (
			generateInterface &&
			!variant.match(/(ref|type)/) &&
			(excludePartitions === true || excludePartitions.length === 0)
		)
			interfaces[capitalizedResource][key] = {
				value,
				variant,
				baseType
			};
	}

	function populateExtraTypes(parentKey, field_key, field_type, { variant, baseType = null }) {
		if (!types.extra[parentKey]) types.extra[parentKey] = {};
		types.extra[parentKey][field_key] = {
			value: field_type,
			variant,
			baseType
		};
	}

	function extractFieldOptions(value, parentKey, isArray) {
		const { mongql = {}, required = false } = value;
		populateObjDefaultValue(mongql, {
			type: isArray ? [ true, true ] : [ true ],
			input: isArray ? [ true, true ] : [ true ],
			writable: global_inputs.base,
			excludePartitions: parentKey ? true : [],
			partitionMapper: {}
		});

		const newPartitionMapper = {
			Mixed: 'Mixed',
			Others: 'Others',
			Self: 'Self',
			...mongql.partitionMapper
		};

		mongql.partitionMapper = newPartitionMapper;

		return {
			mongql,
			required
		};
	}

	function generateVariant(value, isArray) {
		let variant = 'scalar';
		const instanceOfSchema = value instanceof mongoose.Schema;
		if (instanceOfSchema) variant = 'type';
		else if (value.enum) variant = 'enum';
		else if (value.ref) variant = 'ref';
		return variant + (isArray ? 's' : '');
	}

	function generateType(variant, value, extractedFieldOptions, key, path) {
		let field_type = '',
			input_type = null,
			baseType = null;
		if (variant.match(/(type)/)) {
			field_type =
				(appendRTypeToEmbedTypesKey ? capitalizedResource + '_' : '') + (value.type || S(`_${key}`).camelize().s);
			input_type = field_type + 'Input';
			field_type += 'Type';
		} else if (variant === 'enum') {
			field_type = (appendRTypeToEmbedTypesKey ? capitalizedResource.toUpperCase() + '_' : '') + key.toUpperCase();
			enums[field_type] = value.enum;
		} else if (variant.match('ref')) {
			field_type = value.ref + 'Type';
			input_type = `ID`;
			baseType = value.ref;
		} else if (variant.match(/(scalar)/))
			field_type = parseScalarType(value, extractedFieldOptions, `${path ? path + '.' : ''}${key}`);

		input_type = input_type ? input_type : field_type;
		return { field_type, input_type, baseType };
	}

	function transformTypes([ field_type, input_type ], extractedFieldOptions) {
		const { mongql: { input }, isArray, required } = extractedFieldOptions;
		const transformed_field_type = isArray
			? `[${field_type}${input[1] ? '!' : ''}]${input[0] ? '!' : ''}`
			: `${field_type}${input[0] ? '!' : ''}`;

		const transformed_input_type = isArray
			? `[${input_type}${input[1] && required ? '!' : ''}]${input[0] && required ? '!' : ''}`
			: `${input_type}${input[0] && required ? '!' : ''}`;
		return [ transformed_field_type, transformed_input_type ];
	}

	function parseSchema(schema, parentKey, path = undefined) {
		Object.entries(schema.obj).forEach(([ key, value ]) => {
			const isArray = Array.isArray(value);
			const instanceOfSchema = (isArray ? value[0] : value) instanceof mongoose.Schema;
			value = isArray ? value[0] : value;
			const extractedFieldOptions = extractFieldOptions(value, parentKey, isArray);
			const variant = generateVariant(value, isArray);
			const { mongql: { writable } } = extractedFieldOptions;
			let { field_type, input_type, baseType } = generateType(variant, value, extractedFieldOptions, key, path);
			let input_key = parentKey ? parentKey.replace('Type', 'Input') : capitalizedResource + 'Input';

			extractedFieldOptions.variant = variant;
			extractedFieldOptions.baseType = baseType;
			extractedFieldOptions.isArray = isArray;

			const [ transformed_field_type, transformed_input_type ] = transformTypes(
				[ field_type, input_type ],
				extractedFieldOptions
			);

			if (!parentKey) populateBaseTypes(key, transformed_field_type, extractedFieldOptions);
			else
				populateExtraTypes(
					parentKey,
					key,
					(parentKey && variant.match(/(ref)/) ? 'Self' : '') + transformed_field_type,
					extractedFieldOptions
				);

			if (!inputs[input_key]) inputs[input_key] = {};
			if (writable) inputs[input_key][key] = { value: transformed_input_type, variant };

			fields[key] = !instanceOfSchema ? value : 'Schema';

			if (variant.match(/(type)/)) parseSchema(value, field_type, `${path ? path + '.' : ''}${key}`);
		});
	}

	parseSchema(baseSchema);

	const typeArrs = [
		{ comment: 'Enums', startStr: 'enum', obj: enums },
		{
			comment: 'Base types',
			startStr: ({ key }) => `type ${key} ${generateInterface ? 'implements ' + capitalizedResource + ' {\n' : ''}`,
			obj: types.base
		},
		{ comment: 'Extra types', startStr: 'type', obj: types.extra },
		{ comment: 'Inputs', startStr: 'input', obj: inputs }
	];

	if (generateInterface) typeArrs.splice(1, 0, { comment: 'Interfaces', startStr: 'interface', obj: interfaces });

	let typedefTypeStr = ``;
	typeArrs.forEach((typeArr) => (typedefTypeStr += generateTypeStr(typeArr)));
	// fs.writeFile(path.join(dirname, `${resource}.mongql`), `# ${Date.now()}\n${typedefTypeStr}`, 'UTF-8', () => {});
	// fs.writeFile(path.join(dirname, `${resource}.json`), JSON.stringify(schemaObj, null, 2), 'UTF-8', () => {});
	return {
		typedefTypeStr,
		transformedSchema: {
			interfaces,
			inputs,
			types,
			enums,
			fields,
			mongql: baseSchema.mongql
		}
	};
};
