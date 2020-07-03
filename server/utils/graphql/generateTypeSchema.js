const fs = require('fs');
const path = require('path');
const S = require('string');
const mongoose = require('mongoose');

const { UserSchema } = require('../../models/User');
const { QuizSchema } = require('../../models/Quiz');
const { QuestionSchema } = require('../../models/Question');
const { FolderSchema } = require('../../models/Folder');
const { EnvironmentSchema } = require('../../models/Environment');

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

module.exports = function(resource, schema, dirname) {
	const inputs = {};
	const enums = {};
	const interface = {};
	const capitalizedResource = S(resource).capitalize().s;
	const types = {
		[`Mixed${capitalizedResource}`]: {},
		[`Others${capitalizedResource}`]: {},
		[`Self${capitalizedResource}`]: {}
	};
	let schemaStr = ``;
	if (!schema) {
		if (resource === 'user') schema = UserSchema;
		else if (resource === 'quiz') schema = QuizSchema;
		else if (resource === 'question') schema = QuestionSchema;
		else if (resource === 'folder') schema = FolderSchema;
		else if (resource === 'environment') schema = EnvironmentSchema;
	}

	function partsGenerator(parts, purpose) {
		return Object.entries(parts).reduce((partStr, [ key, value ]) => {
			const regex = new RegExp(`(Others|Mixed|Self)${capitalizedResource}`);
			const baseType = purpose === 'type' && key.match(regex);
			return (partStr += `${!baseType
				? purpose + ' ' + key
				: 'type ' + key + ' implements ' + capitalizedResource}${!baseType
				? S(purpose).capitalize().s
				: ''}{\n${Object.entries(value).reduce(
				(keyStr, [ key, { value } ]) => `${(keyStr += '\t' + key + ': ' + value)}\n`,
				''
			)}}\n`);
		}, '');
	}

	function populateType(key, value, { partition, auth, onlySelf, variant, baseType = null }) {
		const isArray = Array.isArray(value);
		function populate(part) {
			types[`${part}${capitalizedResource}`][key] = {
				value: isArray ? '[' + (partition ? part + value : value) + '!]!' : (partition ? part + value : value) + '!',
				variant,
				baseType
			};
		}
		if (!auth && !onlySelf) populate('Mixed');
		if (!onlySelf) populate('Others');
		populate('Self');

		if (!auth && !onlySelf && !partition) interface[key] = isArray ? `[${value}!]!` : `${value}!`;
	}

	function parseSchema(schema, prevKey) {
		Object.entries(schema.obj).forEach(([ key, value ]) => {
			const instanceOfSchema = value instanceof mongoose.Schema;
			const { auth, onlySelf, partition = true } = Array.isArray(value) ? value[0] : value;
			const populateTypeOption = {
				auth,
				onlySelf,
				partition
			};
			let type = '',
				variant = '';
			if (instanceOfSchema) {
				type = value.type || S(`_${key}`).camelize().s;
				variant = 'type';
				populateType(key, type + 'Type', { ...populateTypeOption, partition: false, variant });
				if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
				inputs[capitalizedResource][key] = {
					variant,
					value: `${type}Input!`
				};
				parseSchema(value, type);
			} else if (value.enum) {
				type =
					resource.toUpperCase() +
					'_' +
					(prevKey ? `${prevKey.toUpperCase()}_${key.toUpperCase()}` : `${key.toUpperCase()}`);
				enums[type] = value.enum;
				variant = 'enum';
				if (!prevKey) populateType(key, type, { ...populateTypeOption, partition: false, variant });
			} else if (Array.isArray(value)) {
				if (value[0].ref) {
					variant = 'refs';
					if (!prevKey) populateType(key, [ value[0].ref ], { ...populateTypeOption, variant, baseType: value[0].ref });
					type = '[ID!]';
				} else {
					variant = 'scalars';
					type = parseScalarType(value);
					if (!prevKey) populateType(key, type, { ...populateTypeOption, partition: false, variant });
				}
			} else if (!Array.isArray(value) && value.ref) {
				variant = 'ref';
				if (!prevKey) populateType(key, value.ref, { ...populateTypeOption, variant, baseType: value.ref });
				type = 'ID';
			} else {
				type = parseScalarType(value);
				variant = 'scalar';
				if (!prevKey) populateType(key, type, { ...populateTypeOption, partition: false, variant });
			}

			if (!instanceOfSchema && prevKey) {
				const type_key = schema.type || S(`_${prevKey}`).camelize().s;
				if (!types[type_key]) types[type_key] = {};
				types[type_key][key] = { value: `${type}!`, type: variant };

				if (value.writable || value.writable === undefined) {
					if (!inputs[type_key]) inputs[type_key] = {};
					inputs[type_key][key] = { value: `${type}!`, type: variant };
				}
			} else if (!instanceOfSchema && !prevKey) {
				if (value.writable || value.writable === undefined) {
					if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
					inputs[capitalizedResource][key] = { value: `${type}!`, type: variant };
				}
			}
		});
	}
	parseSchema(schema);

	Object.entries(enums).forEach(([ key, value ]) => {
		schemaStr += `enum ${key}{\n\t${value.join('\n\t')}\n}\n\n`;
	});

	let interfaceStr = `interface ${capitalizedResource}{\n`;
	Object.entries(interface).forEach(([ key, value ]) => {
		interfaceStr += `\t${key}: ${value}\n`;
	});

	interfaceStr += '}\n';
	schemaStr += interfaceStr;

	const inputStr = partsGenerator(inputs, 'input');
	const typeStr = partsGenerator(types, 'type');

	if (!global.Schema[capitalizedResource]) global.Schema[capitalizedResource] = {};
	const schemaObj = {
		interface,
		inputs,
		types,
		enums
	};
	global.Schema[capitalizedResource] = Object.freeze(schemaObj);
	schemaStr += typeStr;
	schemaStr += inputStr;
	if (dirname) fs.writeFileSync(path.join(dirname, `${resource}.graphql`), `# ${Date.now()}\n${schemaStr}`, 'UTF-8');
	if (dirname) fs.writeFileSync(path.join(dirname, `${resource}.json`), JSON.stringify(schemaObj), 'UTF-8');
	return schemaStr;
};
