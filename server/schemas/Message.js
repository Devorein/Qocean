const { gql } = require('apollo-server-express');

module.exports = gql`
	type Message {
		inbox: ID!
		message: String!
		user: SelfUserType!
		time: Date!
		read: Boolean!
		status: String
		sentUser: OthersUserType!
	}
`;
