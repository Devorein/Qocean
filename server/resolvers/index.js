const { resolvers: ExternalResolvers } = require('graphql-scalars');

const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');
const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');
const resolverCompose = require('../utils/resolverCompose');

const resolvers = {};

function transformResolvers(resolver, generate, resource) {
	if (generate !== false) {
		if (generate === true)
			generate = {
				type: true,
				query: true,
				mutation: true
			};
		const { type = false, query = false, mutation = false } = generate;
		if (type) resolver = { ...resolver, ...generateTypeResolvers(resource) };
		if (query) resolver.Query = { ...resolver.Query, ...generateQueryResolvers(resource) };
		if (mutation) resolver.Mutation = { ...resolver.Mutation, ...generateMutationResolvers(resource) };
		return resolver;
	} else return resolver;
}

(() => {
	[
		'auth',
		'user',
		'quiz',
		'question',
		'folder',
		'environment',
		'watchlist',
		'filtersort',
		'report',
		'inbox',
		'message',
		'base'
	].forEach((resource) => {
		let { resolver, generate = false } = require(`./${resource}.js`);
		if (resolver === null) resolver = { Query: {}, Mutation: {} };
		resolvers[resource] = resolverCompose(transformResolvers(resolver, generate, resource.toLowerCase()));
	});
})();

resolvers.External = ExternalResolvers;
module.exports = resolvers;
