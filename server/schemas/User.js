const { gql } = require('apollo-server-express');

const UserInterface = `
  id: ID!
  name: String!
  username: Username!
  email: EmailAddress!
  joined_at: Date!
  total_quizzes: NonNegativeInt!
  total_questions: NonNegativeInt!
  total_folders: NonNegativeInt!
  total_environments: NonNegativeInt!
  version: VersionEnum!
  image: String!
  current_environment: SelfEnvironment!
`;

module.exports = gql`
  enum VersionEnum {
    Rower
    Sailor
    Captain
    Admin
  }

	interface User {
		${UserInterface}
	}

  type OthersUser implements User {
    folders: [MixedFolder!]!
    quizzes: [MixedQuiz!]!
    questions: [MixedQuestion!]!
    environments: [MixedEnvironment!]!
		${UserInterface}
	}

	type MixedUser implements User {
    folders: [OthersFolder!]!
    quizzes: [OthersQuiz!]!
    questions: [OthersQuestion!]!
    environments: [OthersEnvironment!]!
		${UserInterface}
	}

  type SelfUser implements User{
    folders: [SelfFolder!]!
    quizzes: [SelfQuiz!]!
    questions: [SelfQuestion!]!
    environments: [SelfEnvironment!]!
    watchlist: Watchlist!
    filtersort: [FilterSort!]!
    reports: [Report!]!
    inbox: Inbox!
    ${UserInterface}
  }

  type TagOutput{
    uniqueWithoutColor: [String]!
    uniqueWithColor: [String]!
    originalWithoutColor: [String]!
    originalWithColor: [String]!
  }

  input UpdateUserDetailsInput{
    name: String
    email: EmailAddress
    username: Username
    image: String
  }

  input updateUserPasswordInput{
    currentPassword: Password!
    newPassword: Password!
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
		getAllMixedUsersCount: NonNegativeInt!

    # All others
    "Get all other users"
		getAllOthersUsers: [OthersUser!]!

    "Get all other users username and id"
		getAllOthersUsersUsername: [UsernameAndId!]!

    "Get all other users tags"
    getAllOthersUsersTags(config: TagConfigInput): TagOutput!

    "Get all others users count"
		getAllOthersUsersCount: NonNegativeInt!

    # All self
    "Get all self user tags"
    getAllSelfUsersTags(config: TagConfigInput): TagOutput!

    # Paginated mixed
    "Get paginated mixed users (U)"
		getPaginatedMixedUsers(pagination: PaginationInput!): [OthersUser!]!

    "Get paginated mixed users username and id (U)"
		getPaginatedMixedUsersUsername(pagination: PaginationInput!): [UsernameAndId!]!

    "Get filtered mixed users count (U)"
    getFilteredMixedUsersCount(filter: JSON): NonNegativeInt!

    # Paginated others
    "Get paginated others users"
		getPaginatedOthersUsers(pagination: PaginationInput!): [OthersUser!]!

    "Get paginated others users username and id"
		getPaginatedOthersUsersUsername(pagination: PaginationInput!): [UsernameAndId!]!

    "Get filtered others users count"
    getFilteredOthersUsersCount(filter: JSON): NonNegativeInt!

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
