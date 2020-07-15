const {
	transformTypedefTypesAST,
	transformTypedefQueryAST,
	transformTypedefMutationAST
} = require('../ast/transformGraphqlAST');

const generateQueryTypedefs = require('./generateQueryTypedefs');
const generateMutationTypedefs = require('./generateMutationTypedefs');
const generateTypeTypedefs = require('./generateTypeTypedefs');

function transformTypeDefs(
	schema,
	typedefsAST,
	generate,
	resource,
	TypedefsTransformers,
	mutationOpt,
	Validators
) {
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
			const generatedTypeTypedef = generateTypeTypedefs(
				resource,
				schema,
				Validators
			);
			const { typedefTypeStr } = generatedTypeTypedef;
			transformedSchema = generatedTypeTypedef.transformedSchema;
			transformTypedefTypesAST(typedefsAST, typedefTypeStr);
		}
		if (query)
			transformTypedefQueryAST(
				typedefsAST,
				generateQueryTypedefs(resource, transformedSchema)
			);
		if (mutation)
			transformTypedefMutationAST(
				typedefsAST,
				generateMutationTypedefs(
					resource,
					transformedSchema,
					TypedefsTransformers.mutations,
					mutationOpt
				)
			);
		return { typedefsAST, transformedSchema };
	} else return { typedefsAST, transformedSchema: {} };
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
