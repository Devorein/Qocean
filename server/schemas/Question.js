const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Question {
		id: ID!
		name: String!
    type: QuestionTypeEnum!
    format: String!
    weight: PositiveInt!
    add_to_score: Boolean!
    time_allocated: PositiveInt!
    difficulty: QuestionDifficultyEnum!
    image: String!
	}

	type OthersQuestion implements Question {
		id: ID!
		name: String!
    type: QuestionTypeEnum!
    format: String!
    weight: PositiveInt!
    add_to_score: Boolean!
    time_allocated: PositiveInt!
    difficulty: QuestionDifficultyEnum!
    image: String!
    quiz: [OthersQuiz!]!
	}

	type SelfQuestion implements Question {
		id: ID!
		name: String!
    type: QuestionTypeEnum!
    format: String!
    weight: PositiveInt!
    add_to_score: Boolean!
    time_allocated: PositiveInt!
    difficulty: QuestionDifficultyEnum!
    image: String!
		public: Boolean!
		favourite: Boolean!
    answers: [[String]]
    options: [String]
    quiz: [SelfQuiz!]!
	}

  type QuestionAnswersOutput{
    id:ID!
    answers: [[String]!]!
  }

  type QuestionValidationOutput{
    correct: [ID]!
    incorrect: [ID]!
  }

  input CreateQuestionInput{
    name: String!
    type: QuestionTypeEnum!
    format: String
    weight: PositiveInt
    quiz: ID!
    add_to_score: Boolean
    time_allocated: PositiveInt
    difficulty: QuestionDifficultyEnum
    image: String
    answers: [[String]]!
    options: [String!]!
    public: Boolean
    favourite: Boolean
  }

  input UpdateQuestionInput{
    id: ID!
    name: String
    type: QuestionTypeEnum
    format: String
    weight: PositiveInt
    quiz: ID
    add_to_score: Boolean
    time_allocated: PositiveInt
    difficulty: QuestionDifficultyEnum
    image: String
    answers: [[String]]
    options: [String]
    public: Boolean
    favourite: Boolean
  }

  input IdAnswer{
    id: ID!
    answers: [String]!
  }

	extend type Query {
    # All mixed
    "Get all mixed questions (U)"
		getAllMixedQuestions: [OthersQuestion!]!

    "Get all mixed questions name and id (U)"
		getAllMixedQuestionsName: [NameAndId!]!

    "Get all mixed questions count (U)"
		getAllMixedQuestionsCount: NonNegativeInt!

    # All Others
    "Get all other questions"
		getAllOthersQuestions: [OthersQuestion!]!

    "Get all other questions name and id"
		getAllOthersQuestionsName: [NameAndId!]!

    "Get all others questions count"
		getAllOthersQuestionsCount: NonNegativeInt!

    # All Self
    "Get all self questions"
		getAllSelfQuestions: [SelfQuestion!]!

    "Get all self questions name and id"
		getAllSelfQuestionsName: [NameAndId!]!

    "Get all self questions count"
		getAllSelfQuestionsCount: NonNegativeInt!

    # Paginated mixed
    "Get paginated mixed questions (U)"
		getPaginatedMixedQuestions(pagination: PaginationInput!): [OthersQuestion!]!

    "Get paginated mixed questions name and id (U)"
		getPaginatedMixedQuestionsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed questions count (U)"
    getFilteredMixedQuestionsCount(filter: JSON): NonNegativeInt!

    # Paginated others
    "Get paginated others questions"
		getPaginatedOthersQuestions(pagination: PaginationInput!): [OthersQuestion!]!

    "Get paginated others questions name and id"
		getPaginatedOthersQuestionsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others questions count"
    getFilteredOthersQuestionsCount(filter: JSON): NonNegativeInt!

    # Paginated Self
    "Get paginated self questions"
		getPaginatedSelfQuestions(pagination: PaginationInput!): [SelfQuestion!]!

    "Get paginated self questions name and id"
		getPaginatedSelfQuestionsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self questions count"
    getFilteredSelfQuestionsCount(filter: JSON): NonNegativeInt!

    # Id mixed
    "Get mixed question by id (U)"
    getMixedQuestionsById(id:ID!): OthersQuestion!

    "Get mixed question by id answers (U)"
    getMixedQuestionsByIdAnswers(id:ID!): QuestionAnswersOutput!

    "Get mixed question by ids answers (U)"
    getMixedQuestionsByIdsAnswers(ids:[ID!]!): [QuestionAnswersOutput!]!
    
    "Get mixed question by id validation (U)"
    getMixedQuestionsByIdValidation(data: IdAnswer!): QuestionValidationOutput!

    "Get mixed question by ids validation (U)"
    getMixedQuestionsByIdsValidation(data: [IdAnswer!]!): QuestionValidationOutput!

    # Id others
    "Get others question by id"
    getOthersQuestionsById(id:ID!): OthersQuestion!

    # Id self
    "Get others question by id"
    getSelfQuestionsById(id: ID!): SelfQuestion!
	}

  extend type Mutation{
    "Create a new question"
    createQuestion(data: CreateQuestionInput!): SelfQuestion!

    "Update single question"
    updateQuestion(data: UpdateQuestionInput!): SelfQuestion!

    "Update multiple questions"
    updateQuestions(data: [UpdateQuestionInput!]): [SelfQuestion!]!

    "Delete single question"
    deleteQuestion(id: ID!): SelfQuestion!

    "Delete multiple questions"
    deleteQuestions(ids: [ID!]): [SelfQuestion!]!
  }
`;
