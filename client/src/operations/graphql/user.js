import { gql } from '@apollo/client';
import sectorizeData from '../../Utils/sectorizeData';

import { ENV_DATA_DETAILS } from './environment';

const mixedUserData = sectorizeData({}, 'user', { authenticated: false, purpose: 'detail' });
const othersUserData = sectorizeData({}, 'user', { authenticated: false, purpose: 'detail' });
const selfUserData = sectorizeData({}, 'user', { authenticated: true, purpose: 'detail' });

const UserFragments = {};

[ [ 'MIXED', mixedUserData ], [ 'OTHERS', othersUserData ], [ 'SELF', selfUserData ] ].forEach(([ type, arr ]) => {
	[ 'primary', 'secondary', 'tertiary', 'ref', 'refs' ].forEach((sector) => {
		const fields = arr[sector];
		const fragmentContainerName = `${type}_USER_${sector.toUpperCase()}`;
		const capitalizedType = type.charAt(0).toUpperCase() + type.substr(1).toLowerCase();
		const fragmentName = `${capitalizedType}User${sector.charAt(0).toUpperCase() + sector.substr(1)}`;
		UserFragments[fragmentContainerName] = gql`
		  fragment ${fragmentName} on ${capitalizedType}User{
		    ${fields.join('\n')}
		  }
		`;
	});
});

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

export { UserFragments };
