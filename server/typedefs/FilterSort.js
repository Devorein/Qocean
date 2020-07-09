const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query{
    "Get all self filtersorts"
    getAllSelfFilterSorts: [SelfFiltersortType!]!
  }
`;
