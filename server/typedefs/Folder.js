const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation{
    "Update folder ratings"
    updateFoldersRatings(data:RatingsInput!): [RatingsOutput!]!
    "Update folder watch"
    updateFoldersWatch(ids: [ID!]!): NonNegativeInt!
  }
`;
