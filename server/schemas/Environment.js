const { gql } = require('apollo-server-express');

module.exports = gql`

  enum ThemeEnum{
    Light
    Dark
    Navy
  }

  type PageInfo{
    default_ipp: Int!
    default_view: String!
    default_landing: String!
    default_layout: String!
  }

  type KeyBindingType{
    CHECK:String!
    MOVE_UP:String!
    MOVE_DOWN:String!
    LOCAL_ACTION_1:String!
    LOCAL_ACTION_2:String!
    LOCAL_ACTION_3:String!
    LOCAL_ACTION_4:String!
    LOCAL_ACTION_5:String!
    GLOBAL_ACTION_1:String!
    GLOBAL_ACTION_2:String!
    GLOBAL_ACTION_3:String!
    GLOBAL_ACTION_4:String!
    GLOBAL_ACTION_5:String!
  }

  input KeyBindingTypeInput{
    CHECK:String
    MOVE_UP:String
    MOVE_DOWN:String
    LOCAL_ACTION_1:String
    LOCAL_ACTION_2:String
    LOCAL_ACTION_3:String
    LOCAL_ACTION_4:String
    LOCAL_ACTION_5:String
    GLOBAL_ACTION_1:String
    GLOBAL_ACTION_2:String
    GLOBAL_ACTION_3:String
    GLOBAL_ACTION_4:String
    GLOBAL_ACTION_5:String
  }

  input PageInfoInput{
    default_ipp: Int
    default_view: String
    default_landing: String
    default_layout: String
  }

	interface Environment {
		id: ID!
		name: String!
    icon: String!
    theme: ThemeEnum!
    animation: Boolean!
    sound: Boolean!
    hovertips: Boolean!
    default_question_type: QuestionTypeEnum!
	  default_question_difficulty: QuestionDifficultyEnum!
    default_question_timing: Int!
    default_question_weight: Int!
    default_create_landing: String!
    reset_on_success: Boolean!
    reset_on_error: Boolean!
    max_notifications: Int!
    notification_timing: Int!
    default_tag_color: String!
    primary_color: String!
    secondary_color: String!
    display_font: String!
    keybindings: KeyBindingType!
    explore_page: PageInfo!
    play_page: PageInfo!
    self_page: PageInfo!
    watchlist_page: PageInfo!
	}

	type OthersEnvironment implements Environment {
		id: ID!
		name: String!
    icon: String!
    theme: ThemeEnum!
    animation: Boolean!
    sound: Boolean!
    hovertips: Boolean!
    default_question_type: QuestionTypeEnum!
	  default_question_difficulty: QuestionDifficultyEnum!
    default_question_timing: Int!
    default_question_weight: Int!
    default_create_landing: String!
    reset_on_success: Boolean!
    reset_on_error: Boolean!
    max_notifications: Int!
    notification_timing: Int!
    default_tag_color: String!
    primary_color: String!
    secondary_color: String!
    display_font: String!
    keybindings: KeyBindingType!
    explore_page: PageInfo!
    play_page: PageInfo!
    self_page: PageInfo!
    watchlist_page: PageInfo!
	}

	type SelfEnvironment implements Environment {
		id: ID!
		name: String!
    icon: String!
    theme: ThemeEnum!
    animation: Boolean!
    sound: Boolean!
    hovertips: Boolean!
    default_question_type: QuestionTypeEnum!
	  default_question_difficulty: QuestionDifficultyEnum!
    default_question_timing: Int!
    default_question_weight: Int!
    default_create_landing: String!
    reset_on_success: Boolean!
    reset_on_error: Boolean!
    max_notifications: Int!
    notification_timing: Int!
    default_tag_color: String!
    primary_color: String!
    secondary_color: String!
    display_font: String!
		public: Boolean!
		favourite: Boolean!
    keybindings: KeyBindingType!
    explore_page: PageInfo!
    play_page: PageInfo!
    self_page: PageInfo!
    watchlist_page: PageInfo!
	}

	input CreateEnvironmentInput {
		name: String!
    icon: String
    theme: ThemeEnum
    animation: Boolean
    sound: Boolean
    hovertips: Boolean
    default_question_type: QuestionTypeEnum
	  default_question_difficulty: QuestionDifficultyEnum
    default_question_timing: Int
    default_question_weight: Int
    default_create_landing: String
    reset_on_success: Boolean
    reset_on_error: Boolean
    max_notifications: Int
    notification_timing: Int
    default_tag_color: String
    primary_color: String
    secondary_color: String
    display_font: String
		public: Boolean
		favourite: Boolean
    keybindings: KeyBindingTypeInput
    explore_page: PageInfoInput
    play_page: PageInfoInput
    self_page: PageInfoInput
    watchlist_page: PageInfoInput
	}

	input UpdateEnvironmentInput {
		id: ID!
		name: String
		icon: String
    theme: ThemeEnum
    animation: Boolean
    sound: Boolean
    hovertips: Boolean
    default_question_type: QuestionTypeEnum
	  default_question_difficulty: QuestionDifficultyEnum
    default_question_timing: Int
    default_question_weight: Int
    default_create_landing: String
    reset_on_success: Boolean
    reset_on_error: Boolean
    max_notifications: Int
    notification_timing: Int
    default_tag_color: String
    primary_color: String
    secondary_color: String
    display_font: String
		public: Boolean
		favourite: Boolean
    keybindings: KeyBindingTypeInput
    explore_page: PageInfoInput
    play_page: PageInfoInput
    self_page: PageInfoInput
    watchlist_page: PageInfoInput
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

	extend type Mutation{
	  "Create a new environment"
	  createEnvironment(data: CreateEnvironmentInput!): SelfEnvironment!

	  "Update single environment"
	  updateEnvironment(data: UpdateEnvironmentInput!): SelfEnvironment!

	  "Update multiple environments"
	  updateEnvironments(data: [UpdateEnvironmentInput!]): [SelfEnvironment!]!

	  "Set environment as current environment"
	  setCurrentEnvironment(id: ID!): SelfEnvironment!

	  "Delete single environment"
	  deleteEnvironment(id: ID!): SelfEnvironment!

	  "Delete multiple environments"
	  deleteEnvironments(ids: [ID!]): [SelfEnvironment!]!
	}
`;
