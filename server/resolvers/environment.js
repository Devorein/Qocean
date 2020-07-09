const { setCurrentEnvironmentHandler } = require('../handlers/environment');

const EnvironmentResolvers = {
	resolver: {
		Query: {},
		Mutation: {
			async setCurrentEnvironment(parent, { id }, { user, Environment }) {
				return await setCurrentEnvironmentHandler(user.id, id);
			}
		}
	},
	generate: true
};

module.exports = EnvironmentResolvers;
