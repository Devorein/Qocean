const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Folder {
		id: ID!
		name: String!
	}

	type OthersFolder implements Folder {
		id: ID!
		name: String!
	}

	type SelfFolder implements Folder {
		id: ID!
		name: String!
		public: Boolean!
		favourite: Boolean!
	}

	extend type Query {
    # All mixed
    "Get all mixed folders (U)"
		getAllMixedFolders: [OthersFolder!]!

    "Get all mixed folders name and id (U)"
		getAllMixedFoldersName: [NameAndId!]!

    "Get all mixed folders count (U)"
		getAllMixedFoldersCount: Int!

    # All Others
    "Get all other folders"
		getAllOthersFolders: [OthersFolder!]!

    "Get all other folders name and id"
		getAllOthersFoldersName: [NameAndId!]!

    "Get all others folders count"
		getAllOthersFoldersCount: Int!

    # All Self
    "Get all self folders"
		getAllSelfFolders: [SelfFolder!]!

    "Get all self folders name and id"
		getAllSelfFoldersName: [NameAndId!]!

    "Get all self folders count"
		getAllSelfFoldersCount: Int!

    # Paginated mixed
    "Get paginated mixed folders (U)"
		getPaginatedMixedFolders(pagination: PaginationInput!): [OthersFolder!]!

    "Get paginated mixed folders name and id (U)"
		getPaginatedMixedFoldersName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed folders count (U)"
    getFilteredMixedFoldersCount(filter: JSON): Int!

    # Paginated others
    "Get paginated others folders"
		getPaginatedOthersFolders(pagination: PaginationInput!): [OthersFolder!]!

    "Get paginated others folders name and id"
		getPaginatedOthersFoldersName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others folders count"
    getFilteredOthersFoldersCount(filter: JSON): Int!

    # Paginated Self
    "Get paginated self folders"
		getPaginatedSelfFolders(pagination: PaginationInput!): [SelfFolder!]!

    "Get paginated self folders name and id"
		getPaginatedSelfFoldersName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self folders count"
    getFilteredSelfFoldersCount(filter: JSON): Int!

    # Id mixed
    "Get mixed folder by id (U)"
    getMixedFoldersById(id:ID!): OthersFolder!

    # Id others
    "Get others folder by id"
    getOthersFoldersById(id: ID!): OthersFolder!

    # Id self
    "Get others folder by id"
    getSelfFoldersById(id: ID!): SelfFolder!
	}
`;