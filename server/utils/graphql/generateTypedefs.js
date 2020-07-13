const {
	transformTypedefTypesAST,
	transformTypedefQueryAST,
	transformTypedefMutationAST
} = require('../ast/transformGraphqlAST');

const generateTypedefQueryStr = require('./generateTypedefQueryStr');
const generateTypedefMutationStr = require('./generateTypedefMutationStr');
const generateTypedefTypeStr = require('./generateTypedefTypeStr');

function transformTypeDefs(typedefsAST, generate, resource, TypedefsTransformers, mutationOpt, Validators) {
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
		if (mutation)
			transformTypedefMutationAST(
				typedefsAST,
				generateTypedefMutationStr(resource, transformedSchema, TypedefsTransformers.mutations, mutationOpt)
			);
		return { typedefsAST, transformedSchema };
	} else return { typedefsAST, transformedSchema: {} };
}

module.exports = function(resource, generate, typedefsAST, TypedefsTransformers, TypeDefMutationOptions, Validators) {
	let mutationOpt = {
		create: true,
		creates: true,
		delete: true,
		deletes: true,
		update: true,
		updates: true
	};
	mutationOpt = {
		...mutationOpt,
		...TypeDefMutationOptions
	};

	if (typedefsAST === null)
		typedefsAST = {
			kind: 'Document',
			definitions: []
		};
	return transformTypeDefs(
		typedefsAST,
		generate,
		resource.toLowerCase(),
		TypedefsTransformers,
		mutationOpt,
		Validators
	);
};
