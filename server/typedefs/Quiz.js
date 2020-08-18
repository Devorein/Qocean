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

	type Status {
		success: Boolean!
	}

	type QuizQuestionStats {
		questions: [QuestionStats!]!
	}

	type QuestionStats {
		difficulty: QuestionDifficultyEnum!
		type: QuestionTypeEnum!
	}

	extend type Query {
		"Get all self quizzes questions stats"
		getAllSelfQuizzesQuestionsStats: [QuizQuestionStats!]
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
