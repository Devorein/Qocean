const { gql } = require('apollo-server-express');
const generateQueries = require('../utils/generateQueries');

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
    ${generateQueries('user')}

    "Get all mixed users tags (U)"
    getAllSelfUsersTags(config:TagConfigInput): TagOutput!

    "Get all mixed users tags (U)"
    getAllMixedUsersTags(config:TagConfigInput): TagOutput!

    "Get all other users tags"
    getAllOthersUsersTags(config: TagConfigInput): TagOutput!

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
