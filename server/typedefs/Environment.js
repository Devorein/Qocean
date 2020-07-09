const { gql } = require('apollo-server-express');

module.exports = {
	typedef: gql`
    extend type Mutation{
      "Set environment as current environment"
      setCurrentEnvironment(id: ID!): SelfEnvironmentType!
    }
  `,
	generate: true
};
