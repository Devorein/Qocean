const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

module.exports = {
	Mutation: {
		async createReport(parent, { data }, { user, Report }) {
			data.user = user.id;
			return await new Report(data);
		}
	},
	...generateTypeResolvers('report')
};
