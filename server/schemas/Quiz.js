const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Quiz {
		id: ID!
		name: String!
    subject: String!
    tags: [String]!
    image: String
    source: String
	}

	type OthersQuiz implements Quiz {
		id: ID!
		name: String!
    tags: [String]!
    subject: String!
    image: String
    source: String
	}

	type SelfQuiz implements Quiz {
		id: ID!
		name: String!
		public: Boolean!
		favourite: Boolean!
    subject: String!
    tags: [String]!
    image: String
    source: String
	}

  input CreateQuizInput{
    name: String!
    tags: [String]!
    subject: String!
    image: String
    source: String
  }

  input UpdateQuizInput{
    id: ID!
    name: String
    tags: [String]
    subject: String
    image: String
    source: String
  }

	extend type Query {
    # All mixed
    "Get all mixed quizzes (U)"
		getAllMixedQuizzes: [OthersQuiz!]!

    "Get all mixed quizzes name and id (U)"
		getAllMixedQuizzesName: [NameAndId!]!

    "Get all mixed quizzes count (U)"
		getAllMixedQuizzesCount: Int!

    # All Others
    "Get all other quizzes"
		getAllOthersQuizzes: [OthersQuiz!]!

    "Get all other quizzes name and id"
		getAllOthersQuizzesName: [NameAndId!]!

    "Get all others quizzes count"
		getAllOthersQuizzesCount: Int!

    # All Self
    "Get all self quizzes"
		getAllSelfQuizzes: [SelfQuiz!]!

    "Get all self quizzes name and id"
		getAllSelfQuizzesName: [NameAndId!]!

    "Get all self quizzes count"
		getAllSelfQuizzesCount: Int!

    # Paginated mixed
    "Get paginated mixed quizzes (U)"
		getPaginatedMixedQuizzes(pagination: PaginationInput!): [OthersQuiz!]!

    "Get paginated mixed quizzes name and id (U)"
		getPaginatedMixedQuizzesName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed quizzes count (U)"
    getFilteredMixedQuizzesCount(filter: JSON): Int!

    # Paginated others
    "Get paginated others quizzes"
		getPaginatedOthersQuizzes(pagination: PaginationInput!): [OthersQuiz!]!

    "Get paginated others quizzes name and id"
		getPaginatedOthersQuizzesName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others quizzes count"
    getFilteredOthersQuizzesCount(filter: JSON): Int!

    # Paginated Self
    "Get paginated self quizzes"
		getPaginatedSelfQuizzes(pagination: PaginationInput!): [SelfQuiz!]!

    "Get paginated self quizzes name and id"
		getPaginatedSelfQuizzesName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self quizzes count"
    getFilteredSelfQuizzesCount(filter: JSON): Int!

    # Id mixed
    "Get mixed quiz by id (U)"
    getMixedQuizzesById(id:ID!): OthersQuiz!

    # Id others
    "Get others quiz by id"
    getOthersQuizzesById(id: ID!): OthersQuiz!

    # Id self
    "Get others quiz by id"
    getSelfQuizzesById(id: ID!): SelfQuiz!
	}

  extend type Mutation{
    "Create a new quiz"
    createQuiz(data: CreateQuizInput!): SelfQuiz!

    "Update single quiz"
    updateQuiz(data: UpdateQuizInput!): SelfQuiz!

    "Update multiple quizzes"
    updateQuizzes(data: [UpdateQuizInput!]): [SelfQuiz!]!

    "Delete single quiz"
    deleteQuiz(id: ID!): SelfQuiz!

    "Delete multiple quizzes"
    deleteQuizzes(ids: [ID!]): [SelfQuiz!]!
  }
`;
