const {
	updateUserDetailsHandler,
	updateUserPasswordHandler,
	deleteUserHandler,
	getUsersTagsHandler
} = require('../handlers/user');

const UserResolvers = {
	Query: {
		async getAllMixedUsersTags(parent, { config }) {
			return await getUsersTagsHandler({}, config);
		},

		async getAllOthersUsersTags(parent, { config }, { user }) {
			return await getUsersTagsHandler({ _id: { $ne: user.id } }, config);
		},

		async getAllSelfUsersTags(parent, { config }, { user }) {
			return await getUsersTagsHandler({ _id: user.id }, config);
		},

		async getOthersUsersByIdTags(parent, { id, config }) {
			return await getUsersTagsHandler({ _id: id }, config);
		},

		async getSelfUser(parent, args, { user, User }) {
			return await User.findById(user.id);
		}
	},
	Mutation: {
		async updateUserDetails(parent, { data }, { user }) {
			return await updateUserDetailsHandler(data, user.id);
		},
		async updateUserPassword(parent, { data }, { user }) {
			return await updateUserPasswordHandler(user.id, data, (err) => {
				throw err;
			});
		},
		async deleteUser(parent, data, { user }) {
			return await deleteUserHandler(user.id);
		}
	}
};

module.exports = UserResolvers;
