const { resolvers } = require('graphql-scalars');
const { gql } = require('apollo-server-express');

const Password = require('../types/password');
const Username = require('../types/username');

const Validators = {};

Object.entries(resolvers).forEach(([ key, value ]) => {
	Validators[key] = value.serialize;
});
Validators.Password = Password.serialize;
Validators.Username = Username.serialize;
Object.freeze(Validators);

const generateTypedefQueryStr = require('../utils/graphql/generateTypedefQueryStr');
const generateTypedefMutationStr = require('../utils/graphql/generateTypedefMutationStr');
const generateTypedefTypeStr = require('../utils/graphql/generateTypedefTypeStr');

function transformTypedefTypesAST(typedefsAST, typedefTypeStr) {
	typedefsAST.definitions.unshift(...gql`${typedefTypeStr}`.definitions);
}

function transformTypedefQueryAST(typedefsAST, typedefsQueryStr) {
	const queryObjTypeExtension = typedefsAST.definitions.find((definition) => {
		return definition.kind === 'ObjectTypeExtension' && definition.name.value === 'Query';
	});
	if (queryObjTypeExtension) queryObjTypeExtension.fields.push(...gql`${typedefsQueryStr}`.definitions[0].fields);
	else typedefsAST.definitions.push(gql`${typedefsQueryStr}`);
}

function transformTypedefMutationAST(typedefsAST, typedefsMutationStr) {
	const mutationObjTypeExtension = typedefsAST.definitions.find((definition) => {
		return definition.kind === 'ObjectTypeExtension' && definition.name.value === 'Mutation';
	});
	if (mutationObjTypeExtension)
		mutationObjTypeExtension.fields.push(...gql`${typedefsMutationStr}`.definitions[0].fields);
	else typedefsAST.definitions.push(gql`${typedefsMutationStr}`);
}

function transformTypeDefs(typedefsAST, generate, resource) {
	if (generate !== false) {
		if (generate === true)
			generate = {
				type: true,
				query: true,
				mutation: true
			};
		const { type = false, query = false, mutation = false } = generate;
		let transformedSchema = {};
		if (type) {
			const generatedTypeTypedef = generateTypedefTypeStr(resource, null, Validators);
			const { typedefTypeStr } = generatedTypeTypedef;
			transformedSchema = generatedTypeTypedef.transformedSchema;
			transformTypedefTypesAST(typedefsAST, typedefTypeStr);
		}
		if (query) transformTypedefQueryAST(typedefsAST, generateTypedefQueryStr(resource, transformedSchema));
		if (mutation) transformTypedefMutationAST(typedefsAST, generateTypedefMutationStr(resource, transformedSchema));
		return { typedefsAST, transformedSchema };
	} else return { typedefsAST, transformedSchema: {} };
}

module.exports = function(resource, generate) {
	let typedefsAST = require(`./${resource}.js`);
	if (typedefsAST === null)
		typedefsAST = {
			kind: 'Document',
			definitions: []
		};
	return transformTypeDefs(typedefsAST, generate, resource.toLowerCase());
};
