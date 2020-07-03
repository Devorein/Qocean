const { gql } = require('apollo-server-express');

module.exports = gql`
	type InboxType {
		id: ID!
		user: SelfUserType!
		created_at: Date!
		messages: [Message!]!
	}
`;
