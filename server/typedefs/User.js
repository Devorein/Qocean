const { gql } = require('apollo-server-express');

module.exports = gql`
	type TagOutput {
		uniqueWithoutColor: [String]!
		uniqueWithColor: [String]!
		originalWithoutColor: [String]!
		originalWithColor: [String]!
	}

	input UpdateUserDetailsInput {
		name: String
		email: EmailAddress
		username: Username
		image: String
	}

	input UpdateUserPasswordInput {
		currentPassword: Password!
		newPassword: Password!
	}

	input TagConfigInput {
		uniqueWithoutColor: Boolean
		originalWithoutColor: Boolean
		uniqueWithColor: Boolean
		originalWithColor: Boolean
	}

	extend type Query {
		"Get all mixed users tags (U)"
		getAllSelfUsersTags(config: TagConfigInput): TagOutput!

		"Get all mixed users tags (U)"
		getAllMixedUsersTags(config: TagConfigInput): TagOutput!

		"Get all other users tags"
		getAllOthersUsersTags(config: TagConfigInput): TagOutput!

		"Get others users by id tags"
		getOthersUsersByIdTags(id: ID!, config: TagConfigInput): TagOutput!

		"Get self User"
		getSelfUser: SelfUserType!
	}

	extend type Mutation {
		"Update user Details"
		updateUserDetails(data: UpdateUserDetailsInput!): SelfUserType!

		"Update user password"
		updateUserPassword(data: UpdateUserPasswordInput!): AuthPayload!

		"Delete user"
		deleteUser: SelfUserType!
	}
`;
