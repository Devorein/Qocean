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

	type OthersUser implements User {
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

  type SelfUser implements User{
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

  type TagOutput{
    uniqueWithoutColor: [String]!
    uniqueWithColor: [String]!
    originalWithoutColor: [String]!
    originalWithColor: [String]!
  }

  input UpdateUserDetailsInput{
    name: String
    email: String
    username: String
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
    # All mixed
    "Get all mixed users (U)"
		getAllMixedUsers: [OthersUser!]!

    "Get all mixed users username and id (U)"
		getAllMixedUsersUsername: [UsernameAndId!]!

    "Get all mixed users tags (U)"
    getAllMixedUsersTags(config:TagConfigInput): TagOutput!

    "Get all mixed users count (U)"
		getAllMixedUsersCount: Int!

    # All others
    "Get all other users"
		getAllOthersUsers: [OthersUser!]!

    "Get all other users username and id"
		getAllOthersUsersUsername: [UsernameAndId!]!

    "Get all other users tags"
    getAllOthersUsersTags(config: TagConfigInput): TagOutput!

    "Get all others users count"
		getAllOthersUsersCount: Int!

    # All self
    "Get all self user tags"
    getAllSelfUsersTags(config: TagConfigInput): TagOutput!

    # Paginated mixed
    "Get paginated mixed users (U)"
		getPaginatedMixedUsers(pagination: PaginationInput!): [OthersUser!]!

    "Get paginated mixed users username and id (U)"
		getPaginatedMixedUsersUsername(pagination: PaginationInput!): [UsernameAndId!]!

    "Get filtered mixed users count (U)"
    getFilteredMixedUsersCount(filter: JSON): Int!

    # Paginated others
    "Get paginated others users"
		getPaginatedOthersUsers(pagination: PaginationInput!): [OthersUser!]!

    "Get paginated others users username and id"
		getPaginatedOthersUsersUsername(pagination: PaginationInput!): [UsernameAndId!]!

    "Get filtered others users count"
    getFilteredOthersUsersCount(filter: JSON): Int!

    # Id mixed
    "Get mixed user by id (U)"
    getMixedUsersById(id:ID!): OthersUser!

    # Id others
    "Get others users by id"
    getOthersUsersById(id: ID!): OthersUser!

    "Get others users by id tags"
    getOthersUsersByIdTags(id:ID!,config:TagConfigInput): TagOutput! 

    "Get self User"
    getSelfUser: SelfUser!
	}

  extend type Mutation{
    "Update user Details"
    updateUserDetails(data: UpdateUserDetailsInput!): SelfUser!

    "Update user password"
    updateUserPassword(data:updateUserPasswordInput!): AuthPayload!

    "Delete user"
    deleteUser: SelfUser!
  }
`;
