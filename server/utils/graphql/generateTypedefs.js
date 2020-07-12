const { resolvers } = require('graphql-scalars');

const {
	transformTypedefTypesAST,
	transformTypedefQueryAST,
	transformTypedefMutationAST
} = require('../ast/transformGraphqlAST');

const Password = require('../../types/password');
const Username = require('../../types/username');

const Validators = {};

Object.entries(resolvers).forEach(([ key, value ]) => {
	Validators[key] = value.serialize;
});

Validators.Password = Password.serialize;
Validators.Username = Username.serialize;
Object.freeze(Validators);

const generateTypedefQueryStr = require('./generateTypedefQueryStr');
const generateTypedefMutationStr = require('./generateTypedefMutationStr');
const generateTypedefTypeStr = require('./generateTypedefTypeStr');

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

module.exports = function(resource, generate, typedefsAST) {
	if (typedefsAST === null)
		typedefsAST = {
			kind: 'Document',
			definitions: []
		};
	return transformTypeDefs(typedefsAST, generate, resource.toLowerCase());
};
