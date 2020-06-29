import { gql } from '@apollo/client';

import { ENV_DATA_DETAILS } from './environment';
const USER_DATA_NONREL = gql`
	fragment UserDataNonRel on SelfUser {
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

export const getSelfUser = gql`
  query getSelfUser{
    getSelfUser{
      ...UserDataNonRel
    }
  }
  ${USER_DATA_NONREL}
`;

export const getPaginatedMixedUsers = gql`
  query getPaginatedMixedUsers($pagination: PaginationInput!){
    getPaginatedMixedUsers(pagination: $pagination){
      ...UserDataNonRel
    }
    ${USER_DATA_NONREL}
  }
`;

export const getPaginatedOthersUsers = gql`
  query getPaginatedOthersUsers($pagination: PaginationInput!){
    getPaginatedOthersUsers(pagination: $pagination){
      ...UserDataNonRel
    }
    ${USER_DATA_NONREL}
  }
`;

export const getFilteredOthersUsersCount = gql`
	query getFilteredOthersUsersCount($filter: JSON) {
		getFilteredOthersUsersCount(filter: $filter)
	}
`;

export const getFilteredMixedUsersCount = gql`
	query getFilteredMixedUsersCount($filter: JSON) {
		getFilteredMixedUsersCount(filter: $filter)
	}
`;
