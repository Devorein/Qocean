const { gql } = require('apollo-server-express');

module.exports = gql`
	type AuthPayload {
		token: String!
		id: ID!
	}

	input UserInput {
		name: String!
		email: String!
		username: String!
		password: String!
		image: String
		version: String
	}

	input UserSigninInput {
		email: String!
		password: String!
	}

	extend type Query {
		checkPassword(password: String!): Status!
	}

	extend type Mutation {
		register(data: UserInput!): AuthPayload!
		login(data: UserSigninInput!): AuthPayload!
		logout: Status!
	}
`;
