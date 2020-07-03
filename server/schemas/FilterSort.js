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

	type FilterSortType {
		user: SelfUserType!
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
    getAllSelfFilterSorts: [FilterSortType!]!
  }

  extend type Mutation{
    createFilterSort(data: CreateFilterSortInput!): FilterSortType!
    updateFilterSort(data: UpdateFilterSortInput!): FilterSortType!
    deleteFilterSort(id: ID!): FilterSortType!
  }
`;
