import { gql } from '@apollo/client';

const SELF_QUIZ_DATA_CONCISE = gql`
	fragment quizDataConcise on SelfQuestion {
		id
		name
		subject
		tags
		image
		source
		ratings
		raters
		average_quiz_time
		average_difficulty
		total_questions
		total_folders
		total_played
		public
		favourite
	}
`;

const OTHERS_QUIZ_DATA_CONCISE = gql`
	fragment quizDataConcise on OthersQuestion {
		id
		name
		subject
		tags
		image
		source
		ratings
		raters
		average_quiz_time
		average_difficulty
		total_questions
		total_folders
		total_played
		watchers
	}
`;

export const getPaginatedMixedQuizzes = gql`
  query getPaginatedMixedQuizzes($pagination: PaginationInput!){
    getPaginatedMixedQuizzes(pagination: $pagination){
      ...quizDataConcise
    }
  }
  ${OTHERS_QUIZ_DATA_CONCISE}
`;

export const getPaginatedOthersQuizzes = gql`
  query getPaginatedOthersQuizzes($pagination: PaginationInput!){
    getPaginatedOthersQuizzes(pagination: $pagination){
      ...quizDataConcise
    }
  }
  ${OTHERS_QUIZ_DATA_CONCISE}
`;

export const getPaginatedSelfQuizzes = gql`
  query getPaginatedSelfQuizzes($pagination: PaginationInput!){
    getPaginatedSelfQuizzes(pagination: $pagination){
      ...quizDataConcise
    }
  }
  ${SELF_QUIZ_DATA_CONCISE}
`;
