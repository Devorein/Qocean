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

global.Schema = {};

function parseScalarType(value) {
	const isArray = Array.isArray(value);
	const target = isArray ? value[0] : value;
	let type = target.scalar;

	if (Array.isArray(target.type)) {
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
	type = isArray || Array.isArray(value.type) ? `[${type}!]` : type;
	return type;
}

function createDefaultPartition(baseSchema) {
	if (!baseSchema.global_partition) baseSchema.global_partition = {};

	baseSchema.global_partition = {
		base: true,
		extra: false,
		...baseSchema.global_partition
	};
}

module.exports = function(resource, baseSchema, dirname) {
	const inputs = {};
	const enums = {};
	const interface = {};
	const capitalizedResource = S(resource).capitalize().s;

	const types = {};

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
	}

	createDefaultPartition(baseSchema);

	if (baseSchema.global_partition.base) {
		types.base = {
			[`Mixed${capitalizedResource}`]: {},
			[`Others${capitalizedResource}`]: {},
			[`Self${capitalizedResource}`]: {}
		};
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

	function populateBaseTypes(
		key,
		value,
		{ partition, auth, onlySelf, variant, baseType = null, excludePartition = [], partitionMapper }
	) {
		const isArray = Array.isArray(value);
		function populate(part) {
			const new_value = baseSchema.global_partition.base && partition ? partitionMapper[part] + value : value;
			types.base[`${baseSchema.global_partition.base ? part : ''}${capitalizedResource}`][key] = {
				value: isArray ? `[${new_value}!]!` : `${new_value}!`,
				variant,
				baseType
			};
		}
		if (!auth && !onlySelf && !excludePartition.includes('Mixed')) populate('Mixed');
		if (!onlySelf && !excludePartition.includes('Others')) populate('Others');
		if (!excludePartition.includes('Self')) populate('Self');

		if (!auth && !onlySelf && !partition) interface[key] = isArray ? `[${value}!]!` : `${value}!`;
	}

	function populateExtraTypes(
		key,
		value,
		type,
		{ partition, auth, onlySelf, variant, baseType = null, excludePartition = [] }
	) {
		const isArray = Array.isArray(value);
		function populate(part) {
			const shouldPartition = baseSchema.global_partition.extra || partition;
			const partitionKey = `${shouldPartition ? part : ''}${type}`;
			if (!types.extra[partitionKey]) types.extra[partitionKey] = {};
			types.extra[partitionKey][key] = {
				value: isArray ? `[${value}!]!` : `${value}!`,
				variant,
				baseType
			};
		}
		if (!auth && !onlySelf && !excludePartition.includes('Mixed')) populate('Mixed');
		if (!onlySelf && !excludePartition.includes('Others')) populate('Others');
		if (!excludePartition.includes('Self')) populate('Self');
	}

	function parseValue(value, parentKey) {
		const target = Array.isArray(value) ? value[0] : value;
		const {
			auth,
			onlySelf,
			partition = parentKey ? false : true,
			excludePartition = [],
			partitionMapper = {}
		} = target;
		const newPartitionMapper = {
			Mixed: 'Mixed',
			Others: 'Others',
			Self: 'Self',
			...partitionMapper
		};

		return {
			auth,
			onlySelf,
			partition,
			excludePartition,
			partitionMapper: newPartitionMapper
		};
	}

	function parseSchema(schema, parentKey) {
		Object.entries(schema.obj).forEach(([ key, value ]) => {
			const isArray = Array.isArray(value);
			const instanceOfSchema = (isArray ? value[0] : value) instanceof mongoose.Schema;
			const populateTypeOption = parseValue(value, parentKey);
			let type = '',
				variant = '';
			if (instanceOfSchema) {
				type = value.type || S(`_${key}`).camelize().s;
				variant = isArray ? 'types' : 'type';
				populateBaseTypes(key, isArray ? [ `${type}Type` ] : `${type}Type`, {
					...populateTypeOption,
					partition: (isArray ? value[0] : value).partition || false,
					variant
				});
				if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
				inputs[capitalizedResource][key] = {
					variant,
					value: `${type}Input!`
				};
				parseSchema(isArray ? value[0] : value, type);
			} else if (value.enum) {
				type =
					resource.toUpperCase() +
					'_' +
					(parentKey ? `${parentKey.toUpperCase()}_${key.toUpperCase()}` : `${key.toUpperCase()}`);
				enums[type] = value.enum;
				variant = 'enum';
				if (!parentKey) populateBaseTypes(key, type, { ...populateTypeOption, partition: false, variant });
			} else if (Array.isArray(value)) {
				if (value[0].ref) {
					variant = 'refs';
					if (!parentKey)
						populateBaseTypes(key, [ `${baseSchema.global_partition.base ? '' : 'Self'}${value[0].ref}Type` ], {
							...populateTypeOption,
							variant,
							baseType: value[0].ref
						});
					type = '[ID!]';
				} else {
					variant = 'scalars';
					type = parseScalarType(value);
					if (!parentKey) populateBaseTypes(key, type, { ...populateTypeOption, partition: false, variant });
				}
			} else if (!Array.isArray(value) && value.ref) {
				variant = 'ref';
				if (!parentKey)
					populateBaseTypes(key, `${baseSchema.global_partition.base ? '' : 'Self'}${value.ref}Type`, {
						...populateTypeOption,
						variant,
						baseType: value.ref
					});
				type = 'ID';
			} else {
				type = parseScalarType(value);
				variant = 'scalar';
				if (!parentKey) populateBaseTypes(key, type, { ...populateTypeOption, partition: false, variant });
			}

			if (!instanceOfSchema && parentKey) {
				const type_key = schema.type || S(`_${parentKey}`).camelize().s;
				populateExtraTypes(key, type, type_key, {
					...populateTypeOption,
					partition: schema.partition || false,
					variant
				});
				if (value.writable || value.writable === undefined) {
					if (!inputs[type_key]) inputs[type_key] = {};
					inputs[type_key][key] = { value: `${type}!`, variant };
				}
			} else if (!instanceOfSchema && !parentKey) {
				if (value.writable || value.writable === undefined) {
					if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
					inputs[capitalizedResource][key] = { value: `${type}!`, variant };
				}
			}
		});
	}
	parseSchema(baseSchema);

	let enumStr = '# Enums\n';
	Object.entries(enums).forEach(([ key, value ]) => {
		enumStr += `enum ${key}{\n\t${value.join('\n\t')}\n}\n\n`;
	});

	let interfaceStr = `# Interface \ninterface ${capitalizedResource}{\n`;
	Object.entries(interface).forEach(([ key, value ]) => {
		interfaceStr += `\t${key}: ${value}\n`;
	});

	interfaceStr += '}\n';

	// Input string generation
	let inputStr = '# Inputs\n';
	Object.entries(inputs).forEach(([ key, value ]) => {
		inputStr += valueGenerator(`input ${key}Input`, value) + '\n';
	});

	// Base type string generation
	let baseTypeStr = '# Base Types\n';
	Object.entries(types.base).forEach(([ key, value ]) => {
		baseTypeStr += valueGenerator(`type ${key}Type implements ${capitalizedResource}`, value) + '\n';
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
		enums
	};
	global.Schema[capitalizedResource] = Object.freeze(schemaObj);

	[ enumStr, interfaceStr, baseTypeStr, extraTypeStr, inputStr ].forEach((part) => (schemaStr += part));

	if (dirname) fs.writeFileSync(path.join(dirname, `${resource}.graphql`), `# ${Date.now()}\n${schemaStr}`, 'UTF-8');
	if (dirname) fs.writeFileSync(path.join(dirname, `${resource}.json`), JSON.stringify(schemaObj, null, 2), 'UTF-8');
	return schemaStr;
};
