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

	type UsernameAndId {
		username: String!
		id: ID!
	}

	type NameAndId {
		name: String!
		id: ID!
	}

	type RatingsOutput {
		id: ID!
		prevRatings: Float!
		newRatings: Float!
		raters: Int!
	}

	input PaginationInput {
		page: Int!
		limit: Int!
		sort: String
		filter: JSON
	}

	input RatingsInput {
		id: ID!
		ratings: Float!
	}

	type Status {
		success: Boolean!
	}
`;
