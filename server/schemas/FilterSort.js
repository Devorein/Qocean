const { gql } = require('apollo-server-express');

const generateTypeSchema = require('../utils/graphql/generateTypeSchema');
const generateMutations = require('../utils/graphql/generateMutationSchemas');

module.exports = gql`
	${generateTypeSchema('filtersort')}

  extend type Query{
    "Get all self filtersorts"
    getAllSelfFilterSorts: [SelfFiltersortType!]!
  }

  extend type Mutation{
    ${generateMutations('filtersort')}
  }
`;
