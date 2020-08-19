const { gql } = require('apollo-server-express');

module.exports = gql`
  type RatingsOutput {
		id: ID!
		prevRatings: Float!
		newRatings: Float!
		raters: Int!
	}

	input RatingsInput {
		id: ID!
		ratings: Float!
	}

	type QuizQuestionStats {
		questions: [QuestionStats!]!
	}

	type QuestionStats {
		difficulty: QuestionDifficultyEnum!
		type: QuestionTypeEnum!
	}

  type QuizNameAndQuestions{
    name: String!
    questions: [SelfQuestionObject!]!
  }

	extend type Query {
		"Get all self quizzes questions stats"
		getAllSelfQuizzesQuestionsStats: [QuizQuestionStats!]

    getAllSelfQuizzesForPlaypage: [QuizNameAndQuestions!]!
	}

	extend type Mutation {
		"Update quiz played times"
		updateQuizPlayedTimes(ids: [ID!]!): NonNegativeInt!
    "Update quiz ratings"
    updateQuizzesRatings(data:RatingsInput!): [RatingsOutput!]!
    "Update quiz watch"
    updateQuizzesWatch(ids: [ID!]!): NonNegativeInt!
	}
`;
