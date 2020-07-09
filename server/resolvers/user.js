const {
	updateUserDetailsHandler,
	updateUserPasswordHandler,
	deleteUserHandler,
	getUsersTagsHandler
} = require('../handlers/user');

const UserResolvers = {
	resolver: {
		Query: {
			async getAllMixedUsersTags(parent, { config }, { user, User }) {
				return await getUsersTagsHandler({}, config);
			},

			async getAllOthersUsersTags(parent, { config }, { user, User }) {
				return await getUsersTagsHandler({ _id: { $ne: user.id } }, config);
			},

			// ? All Self
			async getAllSelfUsersTags(parent, { config }, { user, User }) {
				return await getUsersTagsHandler({ _id: user.id }, config);
			},

			async getOthersUsersByIdTags(parent, { id, config }, { user }) {
				return await getUsersTagsHandler({ _id: id }, config);
			},

			async getSelfUser(parent, args, { user, User }) {
				return await User.findById(user.id);
			}
		},
		Mutation: {
			async updateUserDetails(parent, { data }, { user, User }) {
				return await updateUserDetailsHandler(data, user.id);
			},
			async updateUserPassword(parent, { data }, { user, User }) {
				return await updateUserPasswordHandler(user.id, data, (err) => {
					throw err;
				});
			},
			async deleteUser(parent, data, { user, User }) {
				return await deleteUserHandler(user.id);
			}
		}
	},
	generate: {
		type: true,
		query: true
	}
};

module.exports = UserResolvers;
