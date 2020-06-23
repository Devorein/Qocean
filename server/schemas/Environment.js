const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Environment {
		id: ID!
		name: String!
	}

	type OthersEnvironment implements Environment {
		id: ID!
		name: String!
	}

	type SelfEnvironment implements Environment {
		id: ID!
		name: String!
		public: Boolean!
		favourite: Boolean!
	}

	extend type Query {
    # All mixed
    "Get all mixed environments (U)"
		getAllMixedEnvironments: [OthersEnvironment!]!

    "Get all mixed environments name and id (U)"
		getAllMixedEnvironmentsName: [NameAndId!]!

    "Get all mixed environments count (U)"
		getAllMixedEnvironmentsCount: Int!

    # All Others
    "Get all other environments"
		getAllOthersEnvironments: [OthersEnvironment!]!

    "Get all other environments name and id"
		getAllOthersEnvironmentsName: [NameAndId!]!

    "Get all others environments count"
		getAllOthersEnvironmentsCount: Int!

    # All Self
    "Get all self environments"
		getAllSelfEnvironments: [SelfEnvironment!]!

    "Get all self environments name and id"
		getAllSelfEnvironmentsName: [NameAndId!]!

    "Get all self environments count"
		getAllSelfEnvironmentsCount: Int!

    # Paginated mixed
    "Get paginated mixed environments (U)"
		getPaginatedMixedEnvironments(pagination: PaginationInput!): [OthersEnvironment!]!

    "Get paginated mixed environments name and id (U)"
		getPaginatedMixedEnvironmentsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed environments count (U)"
    getFilteredMixedEnvironmentsCount(filter: JSON): Int!

    # Paginated others
    "Get paginated others environments"
		getPaginatedOthersEnvironments(pagination: PaginationInput!): [OthersEnvironment!]!

    "Get paginated others environments name and id"
		getPaginatedOthersEnvironmentsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others environments count"
    getFilteredOthersEnvironmentsCount(filter: JSON): Int!

    # Paginated Self
    "Get paginated self environments"
		getPaginatedSelfEnvironments(pagination: PaginationInput!): [SelfEnvironment!]!

    "Get paginated self environments name and id"
		getPaginatedSelfEnvironmentsName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self environments count"
    getFilteredSelfEnvironmentsCount(filter: JSON): Int!

    # Id mixed
    "Get mixed environment by id (U)"
    getMixedEnvironmentsById(id:ID!): OthersEnvironment!

    # Id others
    "Get others environment by id"
    getOthersEnvironmentsById(id: ID!): OthersEnvironment!

    # Id self
    "Get others environment by id"
    getSelfEnvironmentsById(id: ID!): SelfEnvironment!
	}
`;

//
