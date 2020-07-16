const { gql } = require('apollo-server-express');

function transformTypedefTypesAST (typedefsAST, typedefTypeStr) {
	typedefsAST.definitions.unshift(
		...gql`
			${typedefTypeStr}
		`.definitions
	);
}

function transformTypedefObjExtAST (objExtTypeName, typedefsAST, typedefsStr) {
	let objTypeExtension = typedefsAST.definitions.find((definition) => {
		return definition.kind === 'ObjectTypeExtension' && definition.name.value === objExtTypeName;
	});
	if (objTypeExtension === undefined) {
		objTypeExtension = {
			kind: 'ObjectTypeExtension',
			name: { kind: 'Name', value: objExtTypeName },
			interfaces: [],
			directives: [],
			fields: []
		};
		typedefsAST.definitions.push(objTypeExtension);
	}

	objTypeExtension.fields.push(
		...gql`
				${typedefsStr}
			`.definitions[0].fields
	);
}

module.exports = {
	transformTypedefTypesAST,
	transformTypedefObjExtAST
};
