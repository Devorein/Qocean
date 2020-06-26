import { gql } from '@apollo/client';

import { ENV_DATA_DETAILS } from './environment';

const USER_DATA = gql`
	fragment UserData on SelfUser {
		id
		email
		username
		joined_at
		name
		total_quizzes
		total_questions
		total_folders
		total_environments
		current_environment {
			...EnvDataDetails
		}
		version
		image
	}
  ${ENV_DATA_DETAILS}
`;

const getSelfUser = gql`
  query getSelfUser{
    getSelfUser{
      ...UserData
    }
  }
  ${USER_DATA}
`;

export { getSelfUser };
