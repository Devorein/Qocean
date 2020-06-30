const { FolderSchema } = require('../../models/Folder');

function refsGenerator(type, refs) {
	const capitalizedType = type.charAt(0).toUpperCase() + type.substr(1);
	return Object.entries(refs).reduce(
		(refsStr, [ key, value ]) => (refsStr += `\t${key}: [${capitalizedType}${value}!]!\n`),
		''
	);
}

module.exports = function(resource) {
	const capitalizedResource = resource.charAt(0).toUpperCase() + resource.substr(1);

	const TypeDefs = {};
	const interface = {};
	const inputs = {};
	const enums = {};
	const refs = {};
	let typeschema = ``;
	let schema = null;
	if (resource === 'folder') schema = FolderSchema;

	Object.entries(schema.obj).forEach(([ key, value ]) => {
		const capitalizedKey = key.charAt(0).toUpperCase() + key.substr(1);
		if (value.enum) {
			enums[`${capitalizedKey}Enum`] = value.enum.join('\n\t');
			interface[key] = `${capitalizedKey}Enum!`;
		} else if ((!Array.isArray(value) && !value.ref) || (Array.isArray(value) && !value[0].ref)) {
			if (!key.match(/(favourite|public)/)) {
				let type = value.scalar || (value.type && value.type.name);
				if (type === 'ObjectID') type = 'ID!';
				interface[key] = `${type}!`;
			}
		} else if (Array.isArray(value) && value[0].ref) {
			refs[key] = value[0].ref;
		}
	});

	Object.entries(enums).forEach(([ key, value ]) => {
		typeschema += `enum ${key}{\n\t${value}\n}\n`;
	});

	const interfaceStr = Object.entries(interface).reduce(
		(interfaceStr, [ key, value ]) => (interfaceStr += `\t${key}: ${value}\n`),
		''
	);

	const mixedStr = `${interfaceStr}${refsGenerator('Mixed', refs)}`;
	const othersStr = `${interfaceStr}${refsGenerator('Others', refs)}`;
	const selfStr = `${interfaceStr}\tpublic: Boolean!\n\tfavourite: Boolean!\n ${refsGenerator('Self', refs)}`;

	typeschema += `interface ${capitalizedResource}{\n${interfaceStr}}\n`;

	typeschema += `type Mixed${capitalizedResource} implements ${capitalizedResource} {\n ${mixedStr}}\n`;
	typeschema += `type Others${capitalizedResource} implements ${capitalizedResource} {\n ${othersStr}}\n`;
	typeschema += `type Self${capitalizedResource} implements ${capitalizedResource} {\n ${selfStr}}\n`;

	return typeschema;
};
