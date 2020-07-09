const { gql } = require('apollo-server-express');

module.exports = gql`

  type QuizQuestionStats{
    questions: [QuestionStats!]!
  }

  type QuestionStats{
    difficulty: QUESTION_DIFFICULTY!
    type: QUESTION_TYPE!
  }

	extend type Query {
    "Get all self quizzes questions stats"
    getAllSelfQuizzesQuestionsStats: [QuizQuestionStats!]

	}

  extend type Mutation{
    "Update quiz played times"
    updateQuizPlayedTimes(ids:[ID!]!): NonNegativeInt!
  }
`;
