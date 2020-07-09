const { gql } = require('apollo-server-express');

module.exports = gql`

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

    "Get mixed question by id answers (U)"
    getMixedQuestionsByIdAnswers(id:ID!): QuestionAnswersOutput!

    "Get mixed question by ids answers (U)"
    getMixedQuestionsByIdsAnswers(ids:[ID!]!): [QuestionAnswersOutput!]!
    
    "Get mixed question by id validation (U)"
    getMixedQuestionsByIdValidation(data: IdAnswer!): QuestionValidationOutput!

    "Get mixed question by ids validation (U)"
    getMixedQuestionsByIdsValidation(data: [IdAnswer!]!): QuestionValidationOutput!
  }
`;
