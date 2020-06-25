const { gql } = require('apollo-server-express');

module.exports = gql`
	type ReportQuestion {
		question: SelfQuestion!
		user_answers: [String]
		result: Boolean!
		time_taken: NonNegativeInt!
	}

	type ReportDisabled {
		type: [String]
		difficulty: [String]
	}

	type Report {
		name: String!
		user: SelfUser!
		average_points: Float!
		average_time: NonNegativeFloat!
		correct: NonNegativeInt!
		incorrect: NonNegativeInt!
		created_at: Date!
		quizzes: [SelfQuiz!]!
		questions: [ReportQuestion!]!
		disabled: ReportDisabled!
	}

	input ReportQuestionInput {
		question: ID!
		user_answers: [String]
		result: Boolean!
		time_taken: NonNegativeInt!
	}

	input ReportDisabledInput {
		type: [String]
		difficulty: [String]
	}

	input ReportInput {
		name: String!
		user: ID!
		average_points: Float!
		average_time: NonNegativeFloat!
		correct: NonNegativeInt!
		incorrect: NonNegativeInt!
		created_at: Date!
		quizzes: [ID!]!
		questions: [ReportQuestionInput!]!
		disabled: ReportDisabledInput!
	}

	extend type Mutation {
		createReport(data: ReportInput!): Report!
	}
`;
