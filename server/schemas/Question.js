const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQueriesSchemas');
const generateMutations = require('../utils/graphql/generateMutationsSchemas');

const QuestionInterface = `
  id: ID!
  name: String!
  type: QuestionTypeEnum!
  format: String!
  weight: PositiveInt!
  add_to_score: Boolean!
  time_allocated: PositiveInt!
  difficulty: QuestionDifficultyEnum!
  image: String!
`;

module.exports = gql`
	interface Question {
		${QuestionInterface}
	}

  type MixedQuestion implements Question {
    quiz: [MixedQuiz!]!
    ${QuestionInterface}
	}

	type OthersQuestion implements Question {
    quiz: [OthersQuiz!]!
    ${QuestionInterface}
	}

	type SelfQuestion implements Question {
		public: Boolean!
		favourite: Boolean!
    answers: [[String]]
    options: [String]
    quiz: [SelfQuiz!]!
    ${QuestionInterface}
	}

  type QuestionAnswersOutput{
    id:ID!
    answers: [[String]!]!
  }

  type QuestionValidationOutput{
    correct: [ID]!
    incorrect: [ID]!
  }

  input QuestionInput{
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

  input IdAnswer{
    id: ID!
    answers: [String]!
  }

	extend type Query {
    ${generateQueries('question')}

    "Get mixed question by id answers (U)"
    getMixedQuestionsByIdAnswers(id:ID!): QuestionAnswersOutput!

    "Get mixed question by ids answers (U)"
    getMixedQuestionsByIdsAnswers(ids:[ID!]!): [QuestionAnswersOutput!]!
    
    "Get mixed question by id validation (U)"
    getMixedQuestionsByIdValidation(data: IdAnswer!): QuestionValidationOutput!

    "Get mixed question by ids validation (U)"
    getMixedQuestionsByIdsValidation(data: [IdAnswer!]!): QuestionValidationOutput!
	}

  extend type Mutation{
    ${generateMutations('question')}
  }
`;
