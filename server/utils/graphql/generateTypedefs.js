const { transformTypedefTypesAST, transformTypedefObjExtAST } = require('../ast/transformGraphqlAST');

const generateQueryTypedefs = require('./generateQueryTypedefs');
const generateMutationTypedefs = require('./generateMutationTypedefs');
const generateTypeTypedefs = require('./generateTypeTypedefs');

function transformTypeDefs (schema, typedefsAST, generate, resource, TypedefsTransformers, mutationOpt, Validators) {
	let typedefTypeStr = '';
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
			const generatedTypeTypedef = generateTypeTypedefs(resource, schema, Validators);
			typedefTypeStr = generatedTypeTypedef.typedefTypeStr;
			transformedSchema = generatedTypeTypedef.transformedSchema;
			transformTypedefTypesAST(typedefsAST, typedefTypeStr);
		}
		if (query) transformTypedefObjExtAST('Query', typedefsAST, generateQueryTypedefs(resource, transformedSchema));
		if (mutation)
			transformTypedefObjExtAST(
				'Mutation',
				typedefsAST,
				generateMutationTypedefs(resource, transformedSchema, TypedefsTransformers.mutations, mutationOpt),
				resource
			);
		return { typedefsAST, typedefTypeStr, transformedSchema };
	} else return { typedefsAST, typedefTypeStr, transformedSchema: {} };
}

module.exports = function (
	resource,
	schema,
	generate,
	typedefsAST,
	TypedefsTransformers,
	TypeDefMutationOptions,
	Validators
) {
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
		schema,
		typedefsAST,
		generate,
		resource.toLowerCase(),
		TypedefsTransformers,
		mutationOpt,
		Validators
	);
};
