const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/generateQueries');

const FolderInterface = `
  id: ID!
  name: String!
  icon: IconColorEnum!
  ratings: NonNegativeInt!
  total_quizzes: NonNegativeInt!
  total_questions: NonNegativeInt!
`;

module.exports = gql`
	interface Folder {
		${FolderInterface}
	}

	type MixedFolder implements Folder {
    quizzes: [MixedQuiz!]!
    watchers: [MixedUser!]!
		${FolderInterface}
	}

  type OthersFolder implements Folder {
    quizzes: [OthersQuiz!]!
    watchers: [OthersUser!]!
		${FolderInterface}
	}

	type SelfFolder implements Folder {
		public: Boolean!
		favourite: Boolean!
    quizzes: [SelfQuiz!]!
    watchers: [OthersUser!]!
		${FolderInterface}
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
