const { gql } = require('apollo-server-express');

module.exports = gql`
	type ReportQuestionType {
		question: SelfQuestionType!
		user_answers: [String]
		result: Boolean!
		time_taken: NonNegativeInt!
	}

	type ReportDisabledType {
		type: [String]
		difficulty: [String]
	}

	type ReportType {
		name: String!
		user: SelfUserType!
		average_points: Float!
		average_time: NonNegativeFloat!
		correct: NonNegativeInt!
		incorrect: NonNegativeInt!
		created_at: Date!
		quizzes: [SelfQuizType!]!
		questions: [ReportQuestionType!]!
		disabled: ReportDisabledType!
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
		createReport(data: ReportInput!): ReportType!
	}
`;
