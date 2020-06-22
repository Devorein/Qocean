const { gql } = require('apollo-server-express');

module.exports = gql`
  
	interface User {
		id: ID!
		email: String!
		username: String!
		joined_at: Float!
		name: String!
    total_quizzes: Int!
    total_questions: Int!
    total_folders: Int!
    total_environments: Int!
    folders: [Folder!]!
	}

	type PublicUser implements User {
		id: ID!
		email: String!
		username: String!
		joined_at: Float!
		name: String!
    total_quizzes: Int!
    total_questions: Int!
    total_folders: Int!
    total_environments: Int!
    folders: [Folder!]!
	}

  type UserNameAndId {
    username: String!
    id: ID!
  }

	extend type Query {
    "Get paginated public users"
		getPublicUsers(pagination: PaginationInput!): [PublicUser!]!

    "Get all public users username"
		getAllPublicUsersUsername: [UserNameAndId!]!

    "Get all public users"
		getAllPublicUsers: [PublicUser!]!

    "Get public user by id"
    getPublicUserById(id: ID!): PublicUser!

	}
`;
