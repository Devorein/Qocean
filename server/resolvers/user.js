const sendTokenResponse = require('../utils/sendTokenResponse');

async function getUsersTagsHandler (filter, config = {}, User) {
	const {
		uniqueWithoutColor = false,
		originalWithoutColor = false,
		uniqueWithColor = false,
		originalWithColor = false
	} = config;

	const tags = [];
	const users = await User.find(filter).select('quizzes').populate({ path: 'quizzes', select: 'tags' });
	users.forEach((user) => user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag))));
	const noncolouredTags = tags.map((tag) => tag.split(':')[0]);
	return {
		uniqueWithoutColor: uniqueWithoutColor ? Array.from(new Set(noncolouredTags)) : [],
		uniqueWithColor: uniqueWithColor ? Array.from(new Set(tags)) : [],
		originalWithoutColor: originalWithoutColor ? noncolouredTags : [],
		originalWithColor: originalWithColor ? tags : []
	};
}

const UserResolvers = {
	Query: {
		async getAllMixedUsersTags (parent, { config }, { User }) {
			return await getUsersTagsHandler({}, config, User);
		},

		async getAllOthersUsersTags (parent, { config }, { user, User }) {
			return await getUsersTagsHandler({ _id: { $ne: user.id } }, config, User);
		},

		async getAllSelfUsersTags (parent, { config }, { user, User }) {
			return await getUsersTagsHandler({ _id: user.id }, config, User);
		},

		async getOthersUsersByIdTags (parent, { id, config }, { User }) {
			return await getUsersTagsHandler({ _id: id }, config, User);
		},

		async getSelfUser (parent, args, { user, User }) {
			return await User.findById(user.id);
		}
	},
	Mutation: {
		async updateUserDetails (_, { data }, { user, User }) {
			const updateFields = {};
			Object.keys(data).forEach((key) => {
				updateFields[key] = data[key];
			});
			return await User.findByIdAndUpdate(user.id, updateFields, {
				new: true,
				runValidators: true
			});
		},
		async updateUserPassword (parent, { currentPassword, newPassword }, { user, User }) {
			const _user = await User.findById(user.id).select('+password');

			const doesPassMatch = await user.matchPassword(currentPassword);
			if (!doesPassMatch) throw new Error(`Password is incorrect`);

			user.password = newPassword;
			await _user.save();
			return await sendTokenResponse(user);
		}
	}
};

module.exports = UserResolvers;
