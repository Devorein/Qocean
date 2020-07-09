const { gql } = require('apollo-server-express');

module.exports = gql`
	extend type Mutation {
		createReport(data: ReportInput!): SelfReportType!
	}
`;
