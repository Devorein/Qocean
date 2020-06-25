const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
	scalar Password

	scalar Username

	enum QuestionTypeEnum {
		FIB
		Snippet
		MCQ
		MS
		FC
		TF
	}

	enum IconColorEnum {
		Red
		Orange
		Yellow
		Green
		Blue
		Indigo
		Violet
	}

	enum QuestionDifficultyEnum {
		Beginner
		Intermediate
		Advanced
	}

	enum ResourceTypeEnum {
		User
		Folder
		Quiz
		Question
		Environment
	}

	type Query {
		_empty: Boolean
	}

	type Mutation {
		_empty: Boolean
	}

	type UsernameAndId {
		username: String!
		id: ID!
	}

	type NameAndId {
		name: String!
		id: ID!
	}

	type RatingsOutput {
		id: ID!
		prevRatings: Float!
		newRatings: Float!
		raters: Int!
	}

	input PaginationInput {
		page: Int!
		limit: Int!
		sort: String
		filter: JSON
	}

	input RatingsInput {
		id: ID!
		ratings: Float!
	}

	type Status {
		success: Boolean!
	}
`;
