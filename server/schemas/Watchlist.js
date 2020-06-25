const { gql } = require('apollo-server-express');

module.exports = gql`
	type Watchlist {
		user: ID!
		created_at: Date!
		watched_folders: [SelfFolder!]!
		watched_quizzes: [SelfQuiz!]!
	}
`;
