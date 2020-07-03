const { gql } = require('apollo-server-express');

module.exports = gql`
	type WatchlistType {
		user: ID!
		created_at: Date!
		watched_folders: [SelfFolderType!]!
		watched_quizzes: [SelfQuizType!]!
	}
`;
