const { gql } = require('apollo-server-express');

const generateTypeSchema = require('../utils/graphql/generateTypeSchema');
module.exports = gql`
	${generateTypeSchema('filtersort')}

  extend type Query{
    "Get all self filtersorts"
    getAllSelfFilterSorts: [FiltersortType!]!
  }

  extend type Mutation{
    createFilterSort(data: FiltersortInput!): FiltersortType!
    updateFilterSort(data: FiltersortInput!): FiltersortType!
    deleteFilterSort(id: ID!): FiltersortType!
  }
`;
