const { gql } = require('apollo-server-express');

module.exports = gql`
	type Folder {
		name: String!
	}
`;
