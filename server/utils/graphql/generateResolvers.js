const generateQueryResolvers = require('./generateQueryResolvers');
const generateMutationResolvers = require('./generateMutationResolvers');
const generateTypeResolvers = require('./generateTypeResolvers');
const resolverCompose = require('../resolverCompose');

function transformResolvers(
	resolver,
	generate,
	resource,
	transformedSchema,
	ResolversTransformers
) {
	if (generate !== false) {
		if (generate === true)
			generate = {
				type: true,
				query: true,
				mutation: true
			};
		const { type = false, query = false, mutation = false } = generate;
		if (type)
			resolver = {
				...resolver,
				...generateTypeResolvers(resource, transformedSchema)
			};
		if (query)
			resolver.Query = {
				...resolver.Query,
				...generateQueryResolvers(
					resource,
					transformedSchema,
					ResolversTransformers
				)
			};
		if (mutation)
			resolver.Mutation = {
				...resolver.Mutation,
				...generateMutationResolvers(
					resource,
					transformedSchema,
					ResolversTransformers.mutations
				)
			};
		return resolver;
	} else return resolver;
}

module.exports = function (
	resource,
	generate = false,
	transformedSchema,
	resolver,
	ResolversTransformers
) {
	if (resolver === null) resolver = { Query: {}, Mutation: {} };
	return resolverCompose(
		transformResolvers(
			resolver,
			generate,
			resource.toLowerCase(),
			transformedSchema,
			ResolversTransformers
		)
	);
};
