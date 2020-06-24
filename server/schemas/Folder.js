const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Folder {
		id: ID!
		name: String!
    icon: String!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
	}

	type OthersFolder implements Folder {
		id: ID!
		name: String!
    icon: String!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
    quizzes: [OthersQuiz!]!
    watchers: [OthersUser!]!
	}

	type SelfFolder implements Folder {
		id: ID!
		name: String!
    icon: String!
    ratings: NonNegativeInt!
    total_quizzes: NonNegativeInt!
    total_questions: NonNegativeInt!
		public: Boolean!
		favourite: Boolean!
    quizzes: [SelfQuiz!]!
    watchers: [OthersUser!]!
	}

  input CreateFolderInput{
    name: String!
    icon: String
    quizzes:[ID]
    public: Boolean
    favourite: Boolean
  }

  input UpdateFolderInput{
    id: ID!
    name: String
    icon: String
    quizzes:[ID]
    public: Boolean
    favourite: Boolean
  }

	extend type Query {
    # All mixed
    "Get all mixed folders (U)"
		getAllMixedFolders: [OthersFolder!]!

    "Get all mixed folders name and id (U)"
		getAllMixedFoldersName: [NameAndId!]!

    "Get all mixed folders count (U)"
		getAllMixedFoldersCount: NonNegativeInt!

    # All Others
    "Get all other folders"
		getAllOthersFolders: [OthersFolder!]!

    "Get all other folders name and id"
		getAllOthersFoldersName: [NameAndId!]!

    "Get all others folders count"
		getAllOthersFoldersCount: NonNegativeInt!

    # All Self
    "Get all self folders"
		getAllSelfFolders: [SelfFolder!]!

    "Get all self folders name and id"
		getAllSelfFoldersName: [NameAndId!]!

    "Get all self folders count"
		getAllSelfFoldersCount: NonNegativeInt!

    # Paginated mixed
    "Get paginated mixed folders (U)"
		getPaginatedMixedFolders(pagination: PaginationInput!): [OthersFolder!]!

    "Get paginated mixed folders name and id (U)"
		getPaginatedMixedFoldersName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered mixed folders count (U)"
    getFilteredMixedFoldersCount(filter: JSON): NonNegativeInt!

    # Paginated others
    "Get paginated others folders"
		getPaginatedOthersFolders(pagination: PaginationInput!): [OthersFolder!]!

    "Get paginated others folders name and id"
		getPaginatedOthersFoldersName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered others folders count"
    getFilteredOthersFoldersCount(filter: JSON): NonNegativeInt!

    # Paginated Self
    "Get paginated self folders"
		getPaginatedSelfFolders(pagination: PaginationInput!): [SelfFolder!]!

    "Get paginated self folders name and id"
		getPaginatedSelfFoldersName(pagination: PaginationInput!): [NameAndId!]!

    "Get filtered self folders count"
    getFilteredSelfFoldersCount(filter: JSON): NonNegativeInt!

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

  extend type Mutation{
    "Create a new folder"
    createFolder(data: CreateFolderInput!): SelfFolder!

    "Update single folder"
    updateFolder(data: UpdateFolderInput!): SelfFolder!

    "Update multiple folders"
    updateFolders(data: [UpdateFolderInput!]): [SelfFolder!]!

    "Update folder ratings"
    updateFolderRatings(data:RatingsInput!): [RatingsOutput!]!

    "Update folder watch"
    updateFolderWatch(ids: [ID!]!): NonNegativeInt!

    "Delete single folder"
    deleteFolder(id: ID!): SelfFolder!

    "Delete multiple folders"
    deleteFolders(ids: [ID!]): [SelfFolder!]!
  }
`;
