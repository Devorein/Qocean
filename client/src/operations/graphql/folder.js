import { gql } from '@apollo/client';

const SELF_FOLDER_DATA_CONCISE = gql`
	fragment folderDataConcise on SelfFolder {
		id
		name
		icon
		ratings
		total_quizzes
		total_questions
		public
		favourite
	}
`;

const OTHERS_FOLDER_DATA_CONCISE = gql`
	fragment folderDataConcise on OthersFolder {
		id
		name
		icon
		ratings
		total_quizzes
		total_questions
	}
`;

export const getPaginatedMixedFolders = gql`
  query getPaginatedMixedFolders($pagination: PaginationInput!){
    getPaginatedMixedFolders(pagination: $pagination){
      ...folderDataConcise
    }
  }
  ${OTHERS_FOLDER_DATA_CONCISE}
`;

export const getPaginatedOthersFolders = gql`
  query getPaginatedOthersFolders($pagination: PaginationInput!){
    getPaginatedOthersFolders(pagination: $pagination){
      ...folderDataConcise
    }
  }
  ${OTHERS_FOLDER_DATA_CONCISE}
`;

export const getPaginatedSelfFolders = gql`
  query getPaginatedSelfFolders($pagination: PaginationInput!){
    getPaginatedSelfFolders(pagination: $pagination){
      ...folderDataConcise
    }
  }
  ${SELF_FOLDER_DATA_CONCISE}
`;
