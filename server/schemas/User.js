const { gql } = require('apollo-server-express');

module.exports = gql`
	interface User {
		id: ID!
		email: String!
		username: String!
		joined_at: Float!
		name: String!
	}

	type PublicUser implements User {
		id: ID!
		email: String!
		username: String!
		joined_at: Float!
		name: String!
	}

  type UserNameAndId {
    username: String!
    id: ID!
  }

	extend type Query {

    "Get paginated public users"
		getPublicUsers: [PublicUser!]!

    "Get all public users username"
		getAllPublicUsersUsername: [UserNameAndId!]!

    "Get all public users"
		getAllPublicUsers: [PublicUser!]!

	}
`;
