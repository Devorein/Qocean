const { FolderSchema } = require('../../models/Folder');

function refsGenerator(type, refs) {
	const capitalizedType = type.charAt(0).toUpperCase() + type.substr(1);
	return Object.entries(refs).reduce((refsStr, [ key, value ]) => {
		let refValue = capitalizedType + value;
		if (key.match(/^(current_environment|user|quiz)$/)) refValue = `${refValue}!`;
		else refValue = `[${refValue}!]!`;
		return (refsStr += `\t${key}: ${refValue}\n`);
	}, '');
}

module.exports = function(resource) {
	const capitalizedResource = resource.charAt(0).toUpperCase() + resource.substr(1);

	const interface = {};
	const inputs = {};
	const enums = {};
	const refs = {};
	const ref = {};
	let typeschema = ``;
	let schema = null;
	if (resource === 'folder') schema = FolderSchema;

	Object.entries(schema.obj).forEach(([ key, value ]) => {
		const capitalizedKey = key.charAt(0).toUpperCase() + key.substr(1);
		let type = null,
			inputtype = null;
		if (value.enum) {
			type = `${capitalizedKey}Enum`;
			input_type = `${type}!`;
			enums[type] = value.enum.join('\n\t');
			interface[key] = type;
		} else if (Array.isArray(value) && value[0].ref) {
			type = value[0].ref;
			refs[key] = type;
			input_type = '[ID!]!';
		} else if (!Array.isArray(value) && value.ref) {
			type = value.ref;
			ref[key] = type;
			input_type = 'ID!';
		} else {
			type = value.scalar || (value.type && value.type.name);
			if (type === 'ObjectID') type = 'ID!';
			input_type = `${type}!`;
			if (!key.match(/(favourite|public)/)) {
				interface[key] = `${type}!`;
			}
		}

		if (value.writable || value.writable === undefined) inputs[key] = input_type;
	});

	Object.entries(enums).forEach(([ key, value ]) => {
		typeschema += `enum ${key}{\n\t${value}\n}\n`;
	});

	const interfaceStr = Object.entries(interface).reduce(
		(interfaceStr, [ key, value ]) => (interfaceStr += `\t${key}: ${value}\n`),
		''
	);

	const inputStr = Object.entries(inputs).reduce(
		(inputStr, [ key, value ]) => (inputStr += `\t${key}: ${value}\n`),
		''
	);

	const mixedStr = `${interfaceStr}${refsGenerator('Mixed', refs)}${refsGenerator('Mixed', ref)}`;
	const othersStr = `${interfaceStr}${refsGenerator('Others', refs)}${refsGenerator('Others', ref)}`;
	const selfStr = `${interfaceStr}\tpublic: Boolean!\n\tfavourite: Boolean!\n${refsGenerator(
		'Self',
		refs
	)}${refsGenerator('Self', ref)}`;

	typeschema += `interface ${capitalizedResource}{\n${interfaceStr}}\n`;

	typeschema += `type Mixed${capitalizedResource} implements ${capitalizedResource} {\n ${mixedStr}}\n`;
	typeschema += `type Others${capitalizedResource} implements ${capitalizedResource} {\n ${othersStr}}\n`;
	typeschema += `type Self${capitalizedResource} implements ${capitalizedResource} {\n ${selfStr}}\n`;
	typeschema += `input ${capitalizedResource}Input{\n${inputStr}}`;
	console.log(typeschema);
	return typeschema;
};
