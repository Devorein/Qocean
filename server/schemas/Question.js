const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Question {
		id: ID!
		name: String!
	}

	type OthersQuestion implements Question {
		id: ID!
		name: String!
	}

	type SelfQuestion implements Question {
		id: ID!
		name: String!
		public: Boolean!
		favourite: Boolean!
	}

	extend type Query {
    # All mixed
    "Get all mixed questions (U)"
		getAllMixedQuestions: [OthersQuestion!]!

    "Get all mixed questions name and id (U)"
		getAllMixedQuestionsName: [NameAndId!]!

    "Get all mixed questions count (U)"
		getAllMixedQuestionsCount: Int!

    # All Others
    "Get all other questions"
		getAllOthersQuestions: [OthersQuestion!]!

    "Get all other questions name and id"
		getAllOthersQuestionsName: [NameAndId!]!

    "Get all others questions count"
		getAllOthersQuestionsCount: Int!

    # All Self
    "Get all self questions"
		getAllSelfQuestions: [SelfQuestion!]!

    "Get all self questions name and id"
		getAllSelfQuestionsName: [NameAndId!]!

    "Get all self questions count"
		getAllSelfQuestionsCount: Int!

    # Paginated mixed
    "Get paginated mixed questions (U)"
		getPaginatedMixedQuestions(pagination: PaginationInput!): [OthersQuestion!]!

    "Get paginated mixed questions name and id (U)"
		getPaginatedMixedQuestionsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed questions count (U)"
    getFilteredMixedQuestionsCount(filter: JSON): Int!

    # Paginated others
    "Get paginated others questions"
		getPaginatedOthersQuestions(pagination: PaginationInput!): [OthersQuestion!]!

    "Get paginated others questions name and id"
		getPaginatedOthersQuestionsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others questions count"
    getFilteredOthersQuestionsCount(filter: JSON): Int!

    # Paginated Self
    "Get paginated self questions"
		getPaginatedSelfQuestions(pagination: PaginationInput!): [SelfQuestion!]!

    "Get paginated self questions name and id"
		getPaginatedSelfQuestionsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self questions count"
    getFilteredSelfQuestionsCount(filter: JSON): Int!

    # Id mixed
    "Get mixed question by id (U)"
    getMixedQuestionsById(id:ID!): OthersQuestion!

    # Id others
    "Get others question by id"
    getOthersQuestionsById(id: ID!): OthersQuestion!

    # Id self
    "Get others question by id"
    getSelfQuestionsById(id: ID!): SelfQuestion!
	}
`;
