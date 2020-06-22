const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
	scalar JSON

	scalar JSONObject

	type Query {
		_empty: Boolean
	}

	type Mutation {
		_empty: Boolean
	}

	input PaginationInput {
		page: Int!
		limit: Int!
		sort: String
		filter: JSON
	}

	type Status {
		success: Boolean!
	}
`;
