import { gql } from '@apollo/client';

const SELF_ENV_DATA_CONCISE = gql`
	fragment envDataConcise on SelfEnvironment {
		id
		name
		icon
		created_at
		updated_at
		public
		favourite
	}
`;

const OTHERS_ENV_DATA_CONCISE = gql`
	fragment envDataConcise on OthersEnvironment {
		id
		name
		icon
		created_at
		updated_at
	}
`;

const PAGE_INFO = gql`
	fragment PageInfo on PageInfo {
		default_ipp
		default_view
		default_landing
		default_layout
	}
`;

const KEYBINDINGS_INFO = gql`
	fragment KeyBindindsInfo on KeyBindingType {
		CHECK
		MOVE_UP
		MOVE_DOWN
		LOCAL_ACTION_1
		LOCAL_ACTION_2
		LOCAL_ACTION_3
		LOCAL_ACTION_4
		LOCAL_ACTION_5
		GLOBAL_ACTION_1
		GLOBAL_ACTION_2
		GLOBAL_ACTION_3
		GLOBAL_ACTION_4
		GLOBAL_ACTION_5
	}
`;

const QUESTION_INFO = gql`
	fragment QuestionInfo on QuestionInfo {
		default_type
		default_difficulty
		default_timing
		default_weight
	}
`;

export const ENV_DATA_DETAILS = gql`
	fragment EnvDataDetails on SelfEnvironment {
    ...envDataConcise
		theme
		animation
		sound
		hovertips
		default_create_landing
		reset_on_success
		reset_on_error
		max_notifications
		notification_timing
		default_tag_color
		primary_color
		secondary_color
		display_font
    question{
      ...QuestionInfo
    }
    keybindings{
      ...KeyBindindsInfo
    }
		explore_page{
      ...PageInfo
    }
		play_page{
      ...PageInfo
    }
		self_page{
      ...PageInfo
    }
		watchlist_page{
      ...PageInfo
    }
	}
  ${SELF_ENV_DATA_CONCISE}
  ${PAGE_INFO}
  ${QUESTION_INFO}
  ${KEYBINDINGS_INFO}
`;

export const getPaginatedMixedEnvironments = gql`
  query getPaginatedMixedEnvironments($pagination: PaginationInput!){
    getPaginatedMixedEnvironments(pagination: $pagination){
      ...envDataConcise
    }
  }
  ${OTHERS_ENV_DATA_CONCISE}
`;

export const getPaginatedOthersEnvironments = gql`
  query getPaginatedOthersEnvironments($pagination: PaginationInput!){
    getPaginatedOthersEnvironments(pagination: $pagination){
      ...envDataConcise
    }
  }
  ${OTHERS_ENV_DATA_CONCISE}
`;

export const getPaginatedSelfEnvironments = gql`
  query getPaginatedSelfEnvironments($pagination: PaginationInput!){
    getPaginatedSelfEnvironments(pagination: $pagination){
      ...envDataConcise
    }
  }
  ${SELF_ENV_DATA_CONCISE}
`;

export const getFilteredOthersEnvironmentsCount = gql`
	query getFilteredOthersEnvironmentsCount($filter: JSON) {
		getFilteredOthersEnvironmentsCount(filter: $filter)
	}
`;

export const getFilteredMixedEnvironmentsCount = gql`
	query getFilteredMixedEnvironmentsCount($filter: JSON) {
		getFilteredMixedEnvironmentsCount(filter: $filter)
	}
`;

export const getFilteredSelfEnvironmentsCount = gql`
	query getFilteredSelfEnvironmentsCount($filter: JSON) {
		getFilteredSelfEnvironmentsCount(filter: $filter)
	}
`;
