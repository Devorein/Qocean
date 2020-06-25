const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Quiz {
		id: ID!
		name: String!
    subject: String!
    tags: [String]!
    image: String
    source: URL
    ratings: NonNegativeInt!
    raters: NonNegativeInt!
    average_quiz_time: NonNegativeInt!
    average_difficulty: QuestionDifficultyEnum!
    total_questions: NonNegativeInt!
    total_folders: NonNegativeInt!
    total_played: NonNegativeInt!
    watchers: [OthersUser]!
	}

	type OthersQuiz implements Quiz {
		id: ID!
		name: String!
    subject: String!
    tags: [String]!
    image: String
    source: URL
    ratings: NonNegativeInt!
    raters: NonNegativeInt!
    average_quiz_time: NonNegativeInt!
    average_difficulty: QuestionDifficultyEnum!
    total_questions: NonNegativeInt!
    total_folders: NonNegativeInt!
    total_played: NonNegativeInt!
    watchers: [OthersUser]!
    questions:[OthersQuestion]!
    folders: [OthersFolder]!
	}

	type SelfQuiz implements Quiz {
		id: ID!
		name: String!
    subject: String!
    tags: [String]!
    image: String
    source: URL
    ratings: NonNegativeInt!
    raters: NonNegativeInt!
    average_quiz_time: NonNegativeInt!
    average_difficulty: QuestionDifficultyEnum!
    total_questions: NonNegativeInt!
    total_folders: NonNegativeInt!
    total_played: NonNegativeInt!
    watchers: [OthersUser]!
    questions:[SelfQuestion]!
    folders: [SelfFolder]!
    public: Boolean!
    favourite: Boolean!
	}

  type QuestionStats{
    name: String!
    id: ID!
    type: QuestionTypeEnum
    time_allocated: NonNegativeInt!
    difficulty: QuestionDifficultyEnum!
  }

  type QuizQuestionStats{
    name: String!
    id: ID!
    questions: [QuestionStats!]!
  }

  input CreateQuizInput{
    name: String!
    tags: [String]
    subject: String!
    image: String
    source: URL
    folders:[ID]
    public: Boolean
    favourite: Boolean
  }

  input UpdateQuizInput{
    id: ID!
    name: String
    tags: [String]
    subject: String
    image: String
    source: URL
    folders:[ID]
    public: Boolean
    favourite: Boolean
    questions: [ID]
  }

	extend type Query {
    # All mixed
    "Get all mixed quizzes (U)"
		getAllMixedQuizzes: [OthersQuiz!]!

    "Get all mixed quizzes name and id (U)"
		getAllMixedQuizzesName: [NameAndId!]!

    "Get all mixed quizzes count (U)"
		getAllMixedQuizzesCount: NonNegativeInt!

    # All Others
    "Get all other quizzes"
		getAllOthersQuizzes: [OthersQuiz!]!

    "Get all other quizzes name and id"
		getAllOthersQuizzesName: [NameAndId!]!

    "Get all others quizzes count"
		getAllOthersQuizzesCount: NonNegativeInt!

    # All Self
    "Get all self quizzes"
		getAllSelfQuizzes: [SelfQuiz!]!

    "Get all self quizzes name and id"
		getAllSelfQuizzesName: [NameAndId!]!

    "Get all self quizzes count"
		getAllSelfQuizzesCount: NonNegativeInt!

    "Get all self quizzes questions stats"
    getAllSelfQuizzesQuestionsStats: [QuizQuestionStats!]

    # Paginated mixed
    "Get paginated mixed quizzes (U)"
		getPaginatedMixedQuizzes(pagination: PaginationInput!): [OthersQuiz!]!

    "Get paginated mixed quizzes name and id (U)"
		getPaginatedMixedQuizzesName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed quizzes count (U)"
    getFilteredMixedQuizzesCount(filter: JSON): NonNegativeInt!

    # Paginated others
    "Get paginated others quizzes"
		getPaginatedOthersQuizzes(pagination: PaginationInput!): [OthersQuiz!]!

    "Get paginated others quizzes name and id"
		getPaginatedOthersQuizzesName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others quizzes count"
    getFilteredOthersQuizzesCount(filter: JSON): NonNegativeInt!

    # Paginated Self
    "Get paginated self quizzes"
		getPaginatedSelfQuizzes(pagination: PaginationInput!): [SelfQuiz!]!

    "Get paginated self quizzes name and id"
		getPaginatedSelfQuizzesName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self quizzes count"
    getFilteredSelfQuizzesCount(filter: JSON): NonNegativeInt!

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

    "Update quiz played times"
    updateQuizPlayedTimes(ids:[ID!]!): NonNegativeInt!

    "Update quiz ratings"
    updateQuizRatings(data:[RatingsInput!]!): [RatingsOutput!]!

    "Update quiz watch"
    updateQuizWatch(ids: [ID!]!): NonNegativeInt!

    "Delete single quiz"
    deleteQuiz(id: ID!): SelfQuiz!

    "Delete multiple quizzes"
    deleteQuizzes(ids: [ID!]): [SelfQuiz!]!
  }
`;
