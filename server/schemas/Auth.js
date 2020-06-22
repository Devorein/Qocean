const { gql } = require('apollo-server-express');

module.exports = gql`
	type AuthPayload {
		token: String!
		id: ID!
	}

	input UserRegisterInput {
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
		register(data: UserRegisterInput!): AuthPayload!
		login(data: UserSigninInput!): AuthPayload!
		logout: Status!
	}
`;
