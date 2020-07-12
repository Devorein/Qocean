const generateQueryResolvers = require('./generateQueryResolvers');
const generateMutationResolvers = require('./generateMutationResolvers');
const generateTypeResolvers = require('./generateTypeResolvers');
const resolverCompose = require('../resolverCompose');

function transformResolvers(resolver, generate, resource, transformedSchema) {
	if (generate !== false) {
		if (generate === true)
			generate = {
				type: true,
				query: true,
				mutation: true
			};
		const { type = false, query = false, mutation = false } = generate;
		if (type) resolver = { ...resolver, ...generateTypeResolvers(resource, transformedSchema) };
		if (query) resolver.Query = { ...resolver.Query, ...generateQueryResolvers(resource, transformedSchema) };
		if (mutation)
			resolver.Mutation = { ...resolver.Mutation, ...generateMutationResolvers(resource, transformedSchema) };
		return resolver;
	} else return resolver;
}

module.exports = function(resource, generate = false, transformedSchema,resolver) {
	if (resolver === null) resolver = { Query: {}, Mutation: {} };
	return resolverCompose(transformResolvers(resolver, generate, resource.toLowerCase(), transformedSchema));
};
