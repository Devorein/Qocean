const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation{
    "Set environment as current environment"
    setCurrentEnvironment(id: ID!): SelfEnvironmentType!
  }
`;
