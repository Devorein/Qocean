const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateMutations = require('../utils/graphql/generateMutationSchemas');
const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

module.exports = gql`
  ${generateTypeSchema('quiz')}

  type QuizQuestionStats{
    questions: [QuestionStats!]!
  }

  type QuestionStats{
    difficulty: QUESTION_DIFFICULTY!
    type: QUESTION_TYPE!
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
