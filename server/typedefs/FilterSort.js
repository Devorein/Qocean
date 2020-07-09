const { gql } = require('apollo-server-express');

module.exports = {
	typedef: gql`
    extend type Query{
      "Get all self filtersorts"
      getAllSelfFilterSorts: [SelfFiltersortType!]!
    }
  `,
	generate: {
		type: true,
		mutation: true
	}
};
