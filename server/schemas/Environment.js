const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateMutations = require('../utils/graphql/generateMutationSchemas');
const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

generateTypeSchema('environment');

const EnvInterface = `
  id: ID!
  name: String!
  icon: IconColorEnum!
  theme: ThemeEnum!
  animation: Boolean!
  sound: Boolean!
  hovertips: Boolean!
  question: QuestionInfo!
  default_create_landing: String!
  reset_on_success: Boolean!
  reset_on_error: Boolean!
  max_notifications: PositiveInt!
  notification_timing: PositiveInt!
  default_tag_color: HexColorCode!
  primary_color: HexColorCode!
  secondary_color: HexColorCode!
  display_font: String!
  keybindings: KeyBindingType!
  explore_page: PageInfo!
  play_page: PageInfo!
  self_page: PageInfo!
  watchlist_page: PageInfo!
  created_at: Date!
  updated_at: Date!
`;

module.exports = gql`
  enum ThemeEnum{
    Light
    Dark
    Navy
  }

  enum ViewEnum{
    Table
    List
    Board
    Gallery
  }

  type PageInfo{
    default_ipp: PositiveInt!
    default_view: ViewEnum!
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
    default_ipp: PositiveInt
    default_view: ViewEnum
    default_landing: String
    default_layout: String
  }

  input QuestionInfoInput{
    default_type: QuestionTypeEnum
	  default_difficulty: QuestionDifficultyEnum
    default_timing: PositiveInt
    default_weight: PositiveInt
  }

  type QuestionInfo{
    default_type: QuestionTypeEnum
	  default_difficulty: QuestionDifficultyEnum
    default_timing: PositiveInt
    default_weight: PositiveInt
  }

	interface Environment {
		${EnvInterface}
	}

  type MixedEnvironment implements Environment {
		${EnvInterface}
	}

	type OthersEnvironment implements Environment {
		${EnvInterface}
	}

	type SelfEnvironment implements Environment {
		public: Boolean!
		favourite: Boolean!
		${EnvInterface}
	}

	input EnvironmentInput {
		name: String!
    icon: IconColorEnum
    theme: ThemeEnum
    animation: Boolean
    sound: Boolean
    hovertips: Boolean
    question: QuestionInfoInput
    default_create_landing: String
    reset_on_success: Boolean
    reset_on_error: Boolean
    max_notifications: PositiveInt
    notification_timing: PositiveInt
    default_tag_color: HexColorCode
    primary_color: HexColorCode
    secondary_color: HexColorCode
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
    ${generateQueries('environment')}
	}

	extend type Mutation{
	  ${generateMutations('environment')}

    "Set environment as current environment"
	  setCurrentEnvironment(id: ID!): SelfEnvironment!
	}
`;
