const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateMutations = require('../utils/graphql/generateMutationSchemas');

const QuizInterface = `
  id: ID!
  name: String!
  subject: String!
  tags: [String]!
  image: String
  source: URL
  ratings: NonNegativeInt!
  raters: NonNegativeInt!
  average_quiz_time: NonNegativeInt!
  average_difficulty: QuestionDifficultyEnum!
  total_questions: NonNegativeInt!
  total_folders: NonNegativeInt!
  total_played: NonNegativeInt!
`;

module.exports = gql`
	interface Quiz {
		${QuizInterface}
	}

  type MixedQuiz implements Quiz {
    watchers: [MixedUser]!
    questions:[MixedQuestion]!
    folders: [MixedFolder]!
		${QuizInterface}
	}

	type OthersQuiz implements Quiz {
    watchers: [OthersUser]!
    questions:[OthersQuestion]!
    folders: [OthersFolder]!
		${QuizInterface}
	}

	type SelfQuiz implements Quiz {
    watchers: [OthersUser]!
    questions:[SelfQuestion]!
    folders: [SelfFolder]!
    public: Boolean!
    favourite: Boolean!
    ${QuizInterface}
	}

  type QuestionStats{
    name: String!
    id: ID!
    type: QuestionTypeEnum
    time_allocated: NonNegativeInt!
    difficulty: QuestionDifficultyEnum!
  }

  type QuizQuestionStats{
    name: String!
    id: ID!
    questions: [QuestionStats!]!
  }

  input QuizInput{
    name: String!
    tags: [String]
    subject: String!
    image: String
    source: URL
    folders:[ID]
    public: Boolean
    favourite: Boolean
  }

	extend type Query {
    ${generateQueries('quiz')}

    "Get all self quizzes questions stats"
    getAllSelfQuizzesQuestionsStats: [QuizQuestionStats!]

	}

  extend type Mutation{

    ${generateMutations('quiz')}

    "Update quiz played times"
    updateQuizPlayedTimes(ids:[ID!]!): NonNegativeInt!
  }
`;
