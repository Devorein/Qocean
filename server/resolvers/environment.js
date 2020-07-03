const { setCurrentEnvironmentHandler } = require('../handlers/environment');

const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');
const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

const EnvironmentResolvers = {
	Query: {
		...generateQueryResolvers('environment')
	},
	Mutation: {
		async setCurrentEnvironment(parent, { id }, { user, Environment }) {
			return await setCurrentEnvironmentHandler(user.id, id);
		},
		...generateMutationResolvers('environment')
	},
	...generateTypeResolvers('environment')
};

module.exports = resolverCompose(EnvironmentResolvers);
