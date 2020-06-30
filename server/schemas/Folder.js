const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateMutations = require('../utils/graphql/generateMutationSchemas');
const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

module.exports = gql`
	${generateTypeSchema('folder')}

  input FolderInput{
    name: String!
    icon: IconColorEnum
    quizzes:[ID]
    public: Boolean
    favourite: Boolean
  }

	extend type Query {
    ${generateQueries('folder')}
	}

  extend type Mutation{
    ${generateMutations('folder')}
  }
`;
