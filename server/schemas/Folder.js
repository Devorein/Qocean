const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/generateQueries');

module.exports = gql`
	interface Folder {
		id: ID!
		name: String!
    icon: IconColorEnum!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
	}

	type MixedFolder implements Folder {
		id: ID!
		name: String!
    icon: IconColorEnum!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
    quizzes: [OthersQuiz!]!
    watchers: [OthersUser!]!
	}

  type OthersFolder implements Folder {
		id: ID!
		name: String!
    icon: IconColorEnum!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
    quizzes: [OthersQuiz!]!
    watchers: [OthersUser!]!
	}

	type SelfFolder implements Folder {
		id: ID!
		name: String!
    icon: IconColorEnum!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
		public: Boolean!
		favourite: Boolean!
    quizzes: [SelfQuiz!]!
    watchers: [OthersUser!]!
	}

  input CreateFolderInput{
    name: String!
    icon: IconColorEnum
    quizzes:[ID]
    public: Boolean
    favourite: Boolean
  }

  input UpdateFolderInput{
    id: ID!
    name: String
    icon: IconColorEnum
    quizzes:[ID]
    public: Boolean
    favourite: Boolean
  }

	extend type Query {
    ${generateQueries('folder')}
	}

  extend type Mutation{
    "Create a new folder"
    createFolder(data: CreateFolderInput!): SelfFolder!

    "Update single folder"
    updateFolder(data: UpdateFolderInput!): SelfFolder!

    "Update multiple folders"
    updateFolders(data: [UpdateFolderInput!]): [SelfFolder!]!

    "Update folder ratings"
    updateFolderRatings(data:RatingsInput!): [RatingsOutput!]!

    "Update folder watch"
    updateFolderWatch(ids: [ID!]!): NonNegativeInt!

    "Delete single folder"
    deleteFolder(id: ID!): SelfFolder!

    "Delete multiple folders"
    deleteFolders(ids: [ID!]): [SelfFolder!]!
  }
`;
