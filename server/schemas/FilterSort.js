const { gql } = require('apollo-server-express');

module.exports = gql`
	enum FilterItemCondEnum {
		and
		or
	}

	enum SortItemOrderEnum {
		asc
		desc
		none
	}

	type FilterItem {
		target: String!
		mod: String!
		value: String!
		cond: FilterItemCondEnum!
		children: [FilterItem!]!
	}

	type SortItem {
		target: String!
		order: SortItemOrderEnum!
	}

	type FilterSort {
		user: SelfUser!
		type: ResourceTypeEnum!
		name: String!
		filters: [FilterItem!]!
		sorts: [SortItem!]!
	}

  input FilterItemInput {
		target: String!
		mod: String!
		value: String!
		cond: FilterItemCondEnum!
		children: [FilterItemInput!]!
	}

	input SortItemInput {
		target: String!
		order: SortItemOrderEnum!
	}

  input CreateFilterSortInput{
    user: ID!
		type: ResourceTypeEnum!
		name: String!
		filters: [FilterItemInput]
		sorts: [SortItemInput]
  }

  input UpdateFilterSortInput{
    id: ID!
    user: ID
		type: ResourceTypeEnum
		name: String
		filters: [FilterItemInput]
		sorts: [SortItemInput]
  }

  extend type Query{
    "Get all self filtersorts"
    getAllSelfFilterSorts: [FilterSort!]!
  }

  extend type Mutation{
    createFilterSort(data: CreateFilterSortInput!): FilterSort!
    updateFilterSort(data: UpdateFilterSortInput!): FilterSort!
    deleteFilterSort(id: ID!): FilterSort!
  }
`;
