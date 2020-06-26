const { gql } = require('apollo-server-express');

module.exports = gql`
	type Message {
		inbox: ID!
		message: String!
		user: SelfUser!
		time: Date!
		read: Boolean!
		status: String
		sentUser: OthersUser!
	}
`;
