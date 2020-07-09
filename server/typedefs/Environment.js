const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateMutations = require('../utils/graphql/generateMutationSchemas');
const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

module.exports = gql`
  ${generateTypeSchema('environment')}

	extend type Query {
    ${generateQueries('environment')}
	}

	extend type Mutation{
	  ${generateMutations('environment')}

    "Set environment as current environment"
	  setCurrentEnvironment(id: ID!): SelfEnvironmentType!
	}
`;
