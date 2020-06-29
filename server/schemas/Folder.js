const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/generateQueries');
const generateMutations = require('../utils/generateMutations');

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

  input FolderInput{
    name: String!
    icon: IconColorEnum
    quizzes:[ID]
    public: Boolean
    favourite: Boolean
  }

	extend type Query {
    ${generateQueries('folder')}
	}

  extend type Mutation{
    ${generateMutations('folder')}
  }
`;
