const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
	type Query {
		_empty: Boolean
	}

	type Mutation {
		_empty: Boolean
	}
`;
