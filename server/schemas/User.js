const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQuerySchemas');
const generateTypeSchema = require('../utils/graphql/generateTypeSchema');

module.exports = gql`

  ${generateTypeSchema('user')}
  
  type TagOutput{
    uniqueWithoutColor: [String]!
    uniqueWithColor: [String]!
    originalWithoutColor: [String]!
    originalWithColor: [String]!
  }

  input UpdateUserDetailsInput{
    name: String
    email: EmailAddress
    username: Username
    image: String
  }

  input updateUserPasswordInput{
    currentPassword: Password!
    newPassword: Password!
  }

  input TagConfigInput{
    uniqueWithoutColor: Boolean
		originalWithoutColor: Boolean
		uniqueWithColor: Boolean
		originalWithColor: Boolean
  }

	extend type Query {
    ${generateQueries('user')}

    "Get all mixed users tags (U)"
    getAllSelfUsersTags(config:TagConfigInput): TagOutput!

    "Get all mixed users tags (U)"
    getAllMixedUsersTags(config:TagConfigInput): TagOutput!

    "Get all other users tags"
    getAllOthersUsersTags(config: TagConfigInput): TagOutput!

    "Get others users by id tags"
    getOthersUsersByIdTags(id:ID!,config:TagConfigInput): TagOutput! 

    "Get self User"
    getSelfUser: SelfUser!
	}

  extend type Mutation{
    "Update user Details"
    updateUserDetails(data: UpdateUserDetailsInput!): SelfUser!

    "Update user password"
    updateUserPassword(data:updateUserPasswordInput!): AuthPayload!

    "Delete user"
    deleteUser: SelfUser!
  }
`;
