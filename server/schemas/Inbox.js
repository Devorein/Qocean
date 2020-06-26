const { gql } = require('apollo-server-express');

module.exports = gql`
	type Inbox {
		id: ID!
		user: SelfUser!
		created_at: Date!
		messages: [Message!]!
	}
`;
