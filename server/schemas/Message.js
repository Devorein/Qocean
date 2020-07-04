const { gql } = require('apollo-server-express');

const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

module.exports = gql`
  ${generateTypeSchema('message')}
`;
