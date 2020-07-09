const { gql } = require('apollo-server-express');

module.exports = {
	typedef: gql`
		type AuthPayload {
			token: String!
			id: ID!
		}

		input UserRegisterInput {
			name: String!
			email: EmailAddress!
			username: Username!
			password: Password!
			image: String
			version: USER_VERSION
		}

		input UserSigninInput {
			email: EmailAddress!
			password: Password!
		}

		extend type Query {
			checkPassword(password: Password!): Status!
		}

		extend type Mutation {
			register(data: UserRegisterInput!): AuthPayload!
			login(data: UserSigninInput!): AuthPayload!
			logout: Status!
		}
	`,
	generate: false
};
