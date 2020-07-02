const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateMutations = require('../utils/graphql/generateMutationSchemas');
const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

module.exports = gql`
  ${generateTypeSchema('question')}

  type QuestionAnswersOutput{
    id:ID!
    answers: [[String]!]!
  }

  type QuestionValidationOutput{
    correct: [ID]!
    incorrect: [ID]!
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
