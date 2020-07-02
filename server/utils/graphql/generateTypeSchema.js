const fs = require('fs');
const path = require('path');
const S = require('string');
const mongoose = require('mongoose');

const { UserSchema } = require('../../models/User');
const { QuizSchema } = require('../../models/Quiz');
const { QuestionSchema } = require('../../models/Question');
const { FolderSchema } = require('../../models/Folder');
const { EnvironmentSchema } = require('../../models/Environment');

function parseScalar(key, value, prevKey) {
	const isArray = Array.isArray(value);
	const target = isArray ? value[0] : value;
	let type = target.scalar || (target.type && target.type.name) || target.name;

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
	type = isArray ? `[${type}!]` : type;
	let input_type = type;
	return [ type, input_type ];
}

const inputs = {};
const enums = {};
const interface = {};

module.exports = function(resource, schema) {
	const capitalizedResource = S(resource).capitalize().s;
	const types = {
		[`Mixed${capitalizedResource}`]: {},
		[`Others${capitalizedResource}`]: {},
		[`Self${capitalizedResource}`]: {}
	};
	let typeschema = ``;
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
				(keyStr, [ key, value ]) => `${(keyStr += '\t' + key + ': ' + value)}\n`,
				''
			)}}\n`);
		}, '');
	}

	function populateType(key, value, { partition, auth, onlySelf }) {
		const isArray = Array.isArray(value);
		function populate(part) {
			types[`${part}${capitalizedResource}`][key] = isArray
				? '[' + (partition ? part + value : value) + '!]!'
				: (partition ? part + value : value) + '!';
		}

		[ 'Mixed', 'Others', 'Self' ].forEach((part) => {
			if (part === 'Mixed' && !auth && !onlySelf) populate(part);
			else if (part === 'Others' && !onlySelf) populate(part);
			else populate(part);
		});

		if (!auth && !onlySelf && !partition) interface[key] = isArray ? `[${value}!]!` : `${value}!`;
	}

	function parseSchema(schema, prevKey) {
		Object.entries(schema.obj).forEach(([ key, value ]) => {
			const instanceOfSchema = value instanceof mongoose.Schema;
			const { auth, onlySelf } = value;
			let type = '',
				input_type = '';
			if (instanceOfSchema) {
				type = value.type || S(key).capitalize().s;
				input_type = type;
				populateType(key, type + 'Type', { partition: false, auth, onlySelf });
				if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
				inputs[capitalizedResource][key] = `${type}Input!`;
				parseSchema(value, type);
			} else if (value.enum) {
				type = prevKey ? `${prevKey.toUpperCase()}_${key.toUpperCase()}` : `${key.toUpperCase()}`;
				input_type = `${type}`;
				enums[type] = value.enum;
			} else if (Array.isArray(value)) {
				if (value[0].ref) {
					populateType(key, [ value[0].ref ], { partition: true, auth, onlySelf });
					type = '[ID!]';
				} else {
					[ type, input_type ] = parseScalar(key, value, prevKey);
					if (!prevKey) populateType(key, type, { partition: false, auth, onlySelf });
				}
			} else if (!Array.isArray(value) && value.ref) {
				populateType(key, value.ref, { partition: true, auth, onlySelf });
				type = 'ID';
			} else {
				[ type, input_type ] = parseScalar(key, value, prevKey);
				if (!prevKey) populateType(key, type, { partition: false, auth, onlySelf });
			}

			if (!instanceOfSchema && prevKey) {
				const type_key = schema.type || S(prevKey).capitalize().s;
				if (!types[type_key]) types[type_key] = {};
				types[type_key][key] = `${type}!`;

				if (value.writable || value.writable === undefined) {
					if (!inputs[type_key]) inputs[type_key] = {};
					inputs[type_key][key] = `${type}!`;
				}
			} else if (!instanceOfSchema && !prevKey) {
				if (value.writable || value.writable === undefined) {
					if (!inputs[capitalizedResource]) inputs[capitalizedResource] = {};
					inputs[capitalizedResource][key] = `${type}!`;
				}
			}
		});
	}
	parseSchema(schema);
	Object.entries(enums).forEach(([ key, value ]) => {
		typeschema += `enum ${key}{\n\t${value.join('\n\t')}\n}\n\n`;
	});

	let interfaceStr = `interface ${capitalizedResource}{\n`;
	Object.entries(interface).forEach(([ key, value ]) => {
		interfaceStr += `\t${key}: ${value}\n`;
	});

	interfaceStr += '}\n';
	typeschema += interfaceStr;

	const inputStr = partsGenerator(inputs, 'input');
	const typeStr = partsGenerator(types, 'type');

	typeschema += typeStr;
	typeschema += inputStr;

	// fs.writeFileSync(path.join(__dirname, `${resource}.graphql`), typeschema, 'UTF-8');
	// fs.writeFileSync(
	// 	path.join(__dirname, `${resource}.json`),
	// 	JSON.stringify(
	// 		{
	// 			interface,
	// 			types,
	// 			inputs,
	// 			enums
	// 		},
	// 		null,
	// 		2
	// 	),
	// 	'UTF-8'
	// );
	return typeschema;
};
