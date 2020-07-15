function transformTypedefTypesAST(typedefsAST, typedefTypeStr) {
	typedefsAST.definitions.unshift(
		...gql`
			${typedefTypeStr}
		`.definitions
	);
}
const { gql } = require('apollo-server-express');

function transformTypedefQueryAST(typedefsAST, typedefsQueryStr) {
	const queryObjTypeExtension = typedefsAST.definitions.find((definition) => {
		return (
			definition.kind === 'ObjectTypeExtension' &&
			definition.name.value === 'Query'
		);
	});
	if (queryObjTypeExtension)
		queryObjTypeExtension.fields.push(
			...gql`
				${typedefsQueryStr}
			`.definitions[0].fields
		);
	else
		typedefsAST.definitions.push(
			gql`
				${typedefsQueryStr}
			`
		);
}

function transformTypedefMutationAST(typedefsAST, typedefsMutationStr) {
	const mutationObjTypeExtension = typedefsAST.definitions.find(
		(definition) => {
			return (
				definition.kind === 'ObjectTypeExtension' &&
				definition.name.value === 'Mutation'
			);
		}
	);
	if (mutationObjTypeExtension)
		mutationObjTypeExtension.fields.push(
			...gql`
				${typedefsMutationStr}
			`.definitions[0].fields
		);
	else
		typedefsAST.definitions.push(
			gql`
				${typedefsMutationStr}
			`
		);
}

module.exports = {
	transformTypedefTypesAST,
	transformTypedefQueryAST,
	transformTypedefMutationAST
};
