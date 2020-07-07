const fs = require('fs');
const path = require('path');
const S = require('string');
const mongoose = require('mongoose');

const { UserSchema } = require('../../models/User');
const { QuizSchema } = require('../../models/Quiz');
const { QuestionSchema } = require('../../models/Question');
const { FolderSchema } = require('../../models/Folder');
const { EnvironmentSchema } = require('../../models/Environment');
const { ReportSchema } = require('../../models/Report');
const { FilterSortSchema } = require('../../models/FilterSort');
const { WatchlistSchema } = require('../../models/Watchlist');
const { InboxSchema } = require('../../models/Inbox');
const { MessageSchema } = require('../../models/Message');

global.Schema = {};

function createDefaultConfigs(baseSchema) {
	// ? Refactor to use a utility function
	if (!baseSchema.global_configs) baseSchema.global_configs = {};
	const { global_configs } = baseSchema;

	if (global_configs.global_inputs === undefined)
		global_configs.global_inputs = {
			base: true,
			extra: true
		};
	if (global_configs.global_excludePartitions === undefined) {
		global_configs.global_excludePartitions = {
			base: [],
			extra: true
		};
	} else {
		const { base, extra } = global_configs.global_excludePartitions;
		global_configs.global_excludePartitions = {
			base: base === undefined ? [] : base,
			extra: extra === undefined ? true : extra
		};
	}
	if (global_configs.generateInterface === undefined) global_configs.generateInterface = true;
	if (global_configs.appendParentKeyToEmbedTypes === undefined) global_configs.appendParentKeyToEmbedTypes = true;

	global_configs.global_inputs = {
		...global_configs.global_inputs
	};
}

module.exports = function(resource, baseSchema, dirname) {
	const capitalizedResource = S(resource).capitalize().s;

	const types = {};
	const fields = {};

	function parseScalarType(value, { graphql }, path) {
		const isArray = Array.isArray(value);
		const target = isArray ? value[0] : value;
		let type = null;
		if (graphql.scalar) {
			type = graphql.scalar;
			baseSchema.path(path).validate((v) => {
				const value = global.Validators[type](v);
				return value !== null && value !== undefined;
			}, (props) => props.reason.message);
		} else if (Array.isArray(target.type)) {
			if (Array.isArray(target.type[0])) type = `[${target.type[0][0].name}]`;
			else type = target.type[0].name;
		} else if (target.type) type = target.type.name;
		else type = target.name;
		switch (type) {
			case 'Int32':
			case 'Number':
				type = 'Int';
				break;
			case 'Double':
				type = 'Float';
				break;
		}

		if (type === 'ObjectId') type = 'ID';
		type = isArray || Array.isArray(value.type) ? `[${type}${graphql.type[1] ? '!' : ''}]` : type;
		return type;
	}

	let schemaStr = ``;
	if (!baseSchema) {
		if (resource === 'user') baseSchema = UserSchema;
		else if (resource === 'quiz') baseSchema = QuizSchema;
		else if (resource === 'question') baseSchema = QuestionSchema;
		else if (resource === 'folder') baseSchema = FolderSchema;
		else if (resource === 'environment') baseSchema = EnvironmentSchema;
		else if (resource === 'report') baseSchema = ReportSchema;
		else if (resource === 'filtersort') baseSchema = FilterSortSchema;
		else if (resource === 'watchlist') baseSchema = WatchlistSchema;
		else if (resource === 'inbox') baseSchema = InboxSchema;
		else if (resource === 'message') baseSchema = MessageSchema;
	}

	createDefaultConfigs(baseSchema);

	const {
		global_inputs,
		global_excludePartitions,
		generateInterface,
		appendParentKeyToEmbedTypes
	} = baseSchema.global_configs;

	const inputs = {};
	const enums = {};
	const interface = generateInterface
		? {
				id: 'ID!'
			}
		: {};
	if (global_inputs.base) {
		inputs[capitalizedResource] = {};
	}
	if (global_excludePartitions.base !== true) {
		types.base = {};
		[ 'Mixed', 'Others', 'Self' ].forEach((part) => {
			if (!global_excludePartitions.base.includes(part))
				types.base[`${part}${capitalizedResource}`] = {
					id: {
						value: 'ID!',
						variant: 'ID!'
					}
				};
		});
	} else
		types.base = {
			[capitalizedResource]: {}
		};
	types.extra = {};

	function valueGenerator(startStr, value) {
		return `${startStr} {\n${Object.entries(value).reduce(
			(keyStr, [ key, { value } ]) => `${(keyStr += '\t' + key + ': ' + value)}\n`,
			''
		)}}`;
	}

	// ? Combine base and extra type functions
	function populateBaseTypes(key, value, { variant, baseType = null, graphql }) {
		const isArray = Array.isArray(value);
		const { type: [ outerNN, innerNN ], excludePartitions, partitionMapper } = graphql;
		function populate(part) {
			const new_value =
				global_excludePartitions.base !== true && excludePartitions !== true && variant.match(/(ref)/)
					? partitionMapper[part] + value
					: value;
			types.base[`${global_excludePartitions.base ? part : ''}${capitalizedResource}`][key] = {
				value: isArray
					? `[${new_value}${innerNN ? '!' : ''}]${outerNN ? '!' : ''}`
					: `${new_value}${outerNN ? '!' : ''}`,
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
		) {
			interface[key] = isArray
				? `[${value}${innerNN ? '!' : ''}]${outerNN ? '!' : ''}`
				: `${value}${outerNN ? '!' : ''}`;
		}
	}

	function populateExtraTypes(key, value, type, { variant, baseType = null, graphql }) {
		const isArray = Array.isArray(value);
		const { type: [ outerNN, innerNN ], excludePartitions } = graphql;
		function populate(part = '') {
			const shouldPartition = global_excludePartitions.extra;
			const partitionKey = `${shouldPartition ? part : ''}${type}`;
			if (!types.extra[partitionKey]) types.extra[partitionKey] = {};
			types.extra[partitionKey][key] = {
				value: isArray
					? `[${value}${new_value}${innerNN ? '!' : ''}]${outerNN ? '!' : ''}`
					: `${value}${outerNN ? '!' : ''}`,
				variant,
				baseType
			};
		}
		if (Array.isArray(excludePartitions)) {
			if (!global_excludePartitions.base.includes('Mixed') && !excludePartitions.includes('Mixed')) populate('Mixed');
			if (!global_excludePartitions.base.includes('Others') && !excludePartitions.includes('Others'))
				populate('Others');
			if (!global_excludePartitions.base.includes('Self') && !excludePartitions.includes('Self')) populate('Self');
		} else populate();
	}

	function extractFieldOptions(value, parentKey) {
		const target = Array.isArray(value) ? value[0] : value;
		const { graphql = {}, required = false } = target;
		if (!graphql.type) graphql.type = Array.isArray(value) ? [ true, true ] : [ true ];
		if (!graphql.input) graphql.input = Array.isArray(value) ? [ true, true ] : [ true ];
		if (graphql.writable === undefined) graphql.writable = global_inputs.base;
		if (graphql.excludePartitions === undefined) graphql.excludePartitions = parentKey ? true : [];
		if (graphql.partitionMapper === undefined) graphql.partitionMapper = {};

		const newPartitionMapper = {
			Mixed: 'Mixed',
			Others: 'Others',
			Self: 'Self',
			...graphql.partitionMapper
		};

		graphql.partitionMapper = newPartitionMapper;

		return {
			graphql,
			required
		};
	}

	function getVariant(value) {
		let variant = 'scalar';
		const isArray = Array.isArray(value);
		value = isArray ? value[0] : value;
		const instanceOfSchema = value instanceof mongoose.Schema;
		if (instanceOfSchema) variant = 'type';
		else if (value.enum) variant = 'enum';
		else if (value.ref) variant = 'ref';
		return variant + (isArray ? 's' : '');
	}

	function parseSchema(schema, parentKey, path = undefined) {
		Object.entries(schema.obj).forEach(([ key, value ]) => {
			const isArray = Array.isArray(value);
			const instanceOfSchema = (isArray ? value[0] : value) instanceof mongoose.Schema;
			const extractedFieldOptions = extractFieldOptions(value, parentKey);
			let type = '',
				variant = getVariant(value);

			if (variant.match(/(type)/)) {
				type =
					(appendParentKeyToEmbedTypes ? capitalizedResource + '_' : '') + (value.type || S(`_${key}`).camelize().s);
				populateBaseTypes(key, isArray ? [ `${type}Type` ] : `${type}Type`, {
					...extractedFieldOptions,
					variant
				});

				if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
				inputs[capitalizedResource][key] = {
					variant,
					value: `${type}Input!`
				};
				parseSchema(isArray ? value[0] : value, type, `${path ? path + '.' : ''}${key}`);
			} else if (variant === 'enum') {
				type = parentKey
					? `${parentKey.toUpperCase()}_${key.toUpperCase()}`
					: (appendParentKeyToEmbedTypes ? capitalizedResource.toUpperCase() + '_' : '') + key.toUpperCase();
				enums[type] = value.enum;
				variant = 'enum';
				if (!parentKey) populateBaseTypes(key, type, { ...extractedFieldOptions, variant });
			} else if (variant === 'refs') {
				if (!parentKey)
					populateBaseTypes(key, [ `${value[0].ref}Type` ], {
						...extractedFieldOptions,
						variant,
						baseType: value[0].ref,
						isRef: true
					});
				type = `[ID${extractedFieldOptions.graphql.input[1] ? '!' : ''}]`;
			} else if (variant === 'ref') {
				if (!parentKey)
					populateBaseTypes(key, `${value.ref}Type`, {
						...extractedFieldOptions,
						variant,
						baseType: value.ref,
						isRef: true
					});
				type = 'ID';
			} else if (variant.match(/(scalar)/)) {
				type = parseScalarType(value, extractedFieldOptions, `${path ? path + '.' : ''}${key}`);
				if (!parentKey) populateBaseTypes(key, type, { ...extractedFieldOptions, variant });
			}

			const { graphql: { input: [ outerNN ], writable }, required } = extractedFieldOptions;
			if (!instanceOfSchema && parentKey) {
				const type_key = schema.type
					? (appendParentKeyToEmbedTypes ? capitalizedResource + '_' : '') + schema.type
					: parentKey;
				populateExtraTypes(key, type, type_key, {
					...extractedFieldOptions,
					variant
				});
				if (writable) {
					if (!inputs[type_key]) inputs[type_key] = {};
					if (!required) type = type.replace('!', '');
					inputs[type_key][key] = { value: `${type}${required && outerNN ? '!' : ''}`, variant };
				}
			} else if (!instanceOfSchema && !parentKey) {
				if (writable) {
					if (!required) type = type.replace('!', '');
					inputs[capitalizedResource][key] = { value: `${type}${required && outerNN ? '!' : ''}`, variant };
				}
				fields[key] = value;
			} else if (instanceOfSchema && !parentKey) {
				const isArray = Array.isArray(value);
				if (writable) {
					if (!required) type = type.replace('!', '');
					const inputValue = `${type + 'Input'}${required && outerNN ? '!' : ''}`;
					inputs[capitalizedResource][key] = { value: isArray ? `[${inputValue}]` : inputValue, variant };
				}
				fields[key] = 'Schema';
			}
		});
	}
	parseSchema(baseSchema);

	let enumStr = '# Enums\n';
	Object.entries(enums).forEach(([ key, value ]) => {
		enumStr += `enum ${key}{\n\t${value.join('\n\t')}\n}\n\n`;
	});

	let interfaceStr = generateInterface ? `# Interface \ninterface ${capitalizedResource}{\n` : '';
	if (generateInterface) {
		Object.entries(interface).forEach(([ key, value ]) => {
			interfaceStr += `\t${key}: ${value}\n`;
		});
		interfaceStr += '}\n';
	}

	// Input string generation
	let inputStr = '# Inputs\n';
	Object.entries(inputs).forEach(([ key, value ]) => {
		inputStr += valueGenerator(`input ${key}Input`, value) + '\n';
	});

	// Base type string generation
	let baseTypeStr = '# Base Types\n';
	Object.entries(types.base).forEach(([ key, value ]) => {
		baseTypeStr +=
			valueGenerator(`type ${key}Type ${generateInterface ? 'implements ' + capitalizedResource : ''}`, value) + '\n';
	});

	// Extra type string generation
	let extraTypeStr = '# Extra types\n';
	Object.entries(types.extra).forEach(([ key, value ]) => {
		extraTypeStr += valueGenerator(`type ${key}Type`, value) + '\n';
	});

	if (!global.Schema[capitalizedResource]) global.Schema[capitalizedResource] = {};
	const schemaObj = {
		interface,
		inputs,
		types,
		enums,
		fields,
		options: baseSchema.global_configs
	};
	global.Schema[capitalizedResource] = Object.freeze(schemaObj);

	[ enumStr, interfaceStr, baseTypeStr, extraTypeStr, inputStr ].forEach((part) => (schemaStr += part));

	if (dirname) fs.writeFileSync(path.join(dirname, `${resource}.graphql`), `# ${Date.now()}\n${schemaStr}`, 'UTF-8');
	if (dirname) fs.writeFileSync(path.join(dirname, `${resource}.json`), JSON.stringify(schemaObj, null, 2), 'UTF-8');
	return schemaStr;
};
