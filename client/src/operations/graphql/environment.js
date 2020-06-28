import { gql } from '@apollo/client';

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

const ENV_DATA_DETAILS = gql`
	fragment EnvDataDetails on SelfEnvironment {
		id
		name
		icon
		theme
		animation
		sound
		hovertips
		question{
      ...QuestionInfo
    }
		default_create_landing
		reset_on_success
		reset_on_error
		max_notifications
		notification_timing
		default_tag_color
		primary_color
		secondary_color
		display_font
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
		created_at
		updated_at
	}
  ${PAGE_INFO}
  ${QUESTION_INFO}
  ${KEYBINDINGS_INFO}
`;

export { ENV_DATA_DETAILS };
