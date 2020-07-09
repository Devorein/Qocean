module.exports = {
	resolver: {
		Mutation: {
			async createReport(parent, { data }, { user, Report }) {
				data.user = user.id;
				return await new Report(data);
			}
		}
	},
	generate: {
		type: true
	}
};
