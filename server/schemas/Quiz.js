const { gql } = require('apollo-server-express');

module.exports = gql`
	interface Quiz {
		id: ID!
		name: String!
	}

	type OthersQuiz implements Quiz {
		id: ID!
		name: String!
	}

	type SelfQuiz implements Quiz {
		id: ID!
		name: String!
		public: Boolean!
		favourite: Boolean!
	}

	# extend type Query {
	# # "Get paginated quizzes (U)"
	# # getPaginatedQuizzes(pagination: PaginationInput!): [OthersQuiz!]!

	# # "Get filtered quizzes count (U)"
	# # getFilteredQuizzesCount(filter: JSON): Int!

	# # "Get paginated quizzes excluding current logged in users"
	# # getPaginatedOthersQuizzes(pagination: PaginationInput!): [OthersQuiz!]!

	# # "Get filtered quizzes count excluding current logged in users"
	# # getFilteredOthersQuizzesCount(filter:JSON): Int!

	# # "Get all quizzes name"
	# # getAllQuizzesName: [NameAndId!]!

	# # "Get all quizzes (U)"
	# }
`;
