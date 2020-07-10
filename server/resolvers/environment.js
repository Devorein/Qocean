const { setCurrentEnvironmentHandler } = require('../handlers/environment');

const EnvironmentResolvers = {
	Query: {},
	Mutation: {
		async setCurrentEnvironment(parent, { id }, { user }) {
			return await setCurrentEnvironmentHandler(user.id, id);
		}
	}
};

module.exports = EnvironmentResolvers;
