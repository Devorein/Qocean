import { gql } from '@apollo/client';

const SELF_QUESTION_DATA_CONCISE = gql`
	fragment questionDataConcise on SelfQuestion {
		id
		name
		type
		format
		weight
		add_to_score
		time_allocated
		difficulty
		image
		public
		favourite
		answers
		options
		quiz {
			id
			name
		}
	}
`;

const OTHERS_QUESTION_DATA_CONCISE = gql`
	fragment questionDataConcise on OthersQuestion {
		id
		name
		type
		format
		weight
		time_allocated
		difficulty
		image
		quiz {
			id
			name
		}
	}
`;

export const getPaginatedMixedQuestions = gql`
  query getPaginatedMixedQuestions($pagination: PaginationInput!){
    getPaginatedMixedQuestions(pagination: $pagination){
      ...questionDataConcise
    }
  }
  ${OTHERS_QUESTION_DATA_CONCISE}
`;

export const getPaginatedOthersQuestions = gql`
  query getPaginatedOthersQuestions($pagination: PaginationInput!){
    getPaginatedOthersQuestions(pagination: $pagination){
      ...questionDataConcise
    }
  }
  ${OTHERS_QUESTION_DATA_CONCISE}
`;

export const getPaginatedSelfQuestions = gql`
  query getPaginatedSelfQuestions($pagination: PaginationInput!){
    getPaginatedSelfQuestions(pagination: $pagination){
      ...questionDataConcise
    }
  }
  ${SELF_QUESTION_DATA_CONCISE}
`;

export const getFilteredOthersQuestionsCount = gql`
	query getFilteredOthersQuestionsCount($filter: JSON) {
		getFilteredOthersQuestionsCount(filter: $filter)
	}
`;

export const getFilteredMixedQuestionsCount = gql`
	query getFilteredMixedQuestionsCount($filter: JSON) {
		getFilteredMixedQuestionsCount(filter: $filter)
	}
`;

export const getFilteredSelfQuestionsCount = gql`
	query getFilteredSelfQuestionsCount($filter: JSON) {
		getFilteredSelfQuestionsCount(filter: $filter)
	}
`;
