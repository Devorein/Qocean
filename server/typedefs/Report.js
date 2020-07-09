const { gql } = require('apollo-server-express');

module.exports = {
	typedef: gql`
		extend type Mutation {
			createReport(data: ReportInput!): SelfReportType!
		}
	`,
	generate: {
		type: true
	}
};
