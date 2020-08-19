const { gql } = require('apollo-server-express');

module.exports = gql`
  input FolderQuizzesInput{
    op: Int!
    quiz: ID!
    folder: ID!
  }
  
  extend type Mutation{
    changeFolderQuizzes(data:FolderQuizzesInput!): Status!
    "Update folder ratings"
    updateFoldersRatings(data:RatingsInput!): [RatingsOutput!]!
    "Update folder watch"
    updateFoldersWatch(ids: [ID!]!): NonNegativeInt!
  }
`;
