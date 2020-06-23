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

  type PrivateUser implements User{
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

  type TagOutput{
    uniqueWithoutColor: [String]!
    uniqueWithColor: [String]!
    originalWithoutColor: [String]!
    originalWithColor: [String]!
  }

  input UpdateUserDetailsInput{
    name: String!
    email: String!
    username: String!
    image: String
  }

  input updateUserPasswordInput{
    currentPassword: String!
    newPassword: String!
  }

  input TagConfigInput{
    uniqueWithoutColor: Boolean
		originalWithoutColor: Boolean
		uniqueWithColor: Boolean
		originalWithColor: Boolean
  }

	extend type Query {
    "Get paginated public users"
		getPublicUsers(pagination: PaginationInput!): [PublicUser!]!

    "Get filtered public users count"
    getPublicUsersCount(filter: JSON): Int!

    "Get paginated public user excluding current logged in user"
    getPublicUsersExceptLoggedin(pagination: PaginationInput!): [PublicUser!]!

    "Get all public users username"
		getAllPublicUsersUsername: [UserNameAndId!]!

    "Get all public users"
		getAllPublicUsers: [PublicUser!]!

    "Get public user by id"
    getPublicUserById(id: ID!): PublicUser!

    "Get the current logged in User"
    getCurrentUser: PrivateUser!

    "Get the tags of a specific user"
    getUserTags(config: TagConfigInput,userId:ID!): TagOutput!

    "Get my tags"
    getMyTags(config: TagConfigInput): TagOutput!

    "Get all tags"
    getAllTags: [String!]!
	}

  extend type Mutation{
    "Update user Details"
    updateUserDetails(data: UpdateUserDetailsInput!): PrivateUser!

    "Update user password"
    updateUserPassword(data:updateUserPasswordInput!): AuthPayload!

    "Delete user"
    deleteUser: PrivateUser!
  }
`;
