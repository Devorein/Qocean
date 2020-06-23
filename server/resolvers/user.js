const parsePagination = require('../utils/parsePagination');
const {
	updateUserDetailsHandler,
	updateUserPasswordHandler,
	deleteUserHandler,
	getUsersTagsHandler,
	userPhotoUpload
} = require('../controllers/user');

module.exports = {
	Query: {
		// ? All Mixed
		async getAllMixedUsers(parent, args, { User }) {
			return await User.find({});
		},

		async getAllMixedUsersUsername(parent, args, { user, User }) {
			return await User.find().select('username');
		},

		async getAllMixedUsersTags(parent, { config }, { user, User }) {
			return await getUsersTagsHandler({}, config);
		},

		async getAllMixedUsersCount(parent, args, { User }) {
			return await User.countDocuments({});
		},

		// ? All Others
		async getAllOthersUsers(parent, args, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await User.find({ _id: { $ne: user.id } });
		},

		async getAllOthersUsersUsername(parent, args, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await User.find({ _id: { $ne: user.id } }).select('username');
		},

		async getAllOthersUsersTags(parent, { config }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await getUsersTagsHandler({ _id: { $ne: user.id } }, config);
		},

		async getAllOthersUsersCount(parent, args, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await User.countDocuments({ _id: { $ne: user.id } });
		},

		// ? All Self
		async getAllSelfUsersTags(parent, { config }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await getUsersTagsHandler({ _id: user.id }, config);
		},

		// ? Paginated mixed
		async getPaginatedMixedUsers(parent, { pagination }, { User }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await User.find(filter).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedMixedUsersUsername(parent, { pagination }, { user, User }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await User.find(filter).sort(sort).skip(page).limit(limit).select('username');
		},

		async getFilteredMixedUsersCount(parent, { filter = '{}' }, { User }) {
			return await User.countDocuments(JSON.parse(filter));
		},

		// ? Paginated Others
		async getPaginatedOthersUsers(parent, { pagination }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await User.find({ ...filter, _id: { $ne: user.id } }).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedOthersUsersUsername(parent, { pagination }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await User.find({ ...filter, _id: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('username');
		},

		async getFilteredOthersUsersCount(parent, { filter = '{}' }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await User.countDocuments({ ...JSON.parse(filter), _id: { $ne: user.id } });
			return count;
		},

		// ? Id mixed
		async getMixedUsersById(parent, { id }, { User }) {
			return await User.findById(id);
		},

		// ? Id Others
		async getOthersUsersById(parent, { id }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await User.findById(id);
		},
		async getOthersUsersByIdTags(parent, { id, config }, { user }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await getUsersTagsHandler({ _id: id }, config);
		},

		async getSelfUser(parent, args, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await User.findById(user.id);
		}
	},
	Mutation: {
		async updateUserDetails(parent, { data }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await updateUserDetailsHandler(data, user.id);
		},
		async updateUserPassword(parent, { data }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await updateUserPasswordHandler(user.id, data, (err) => {
				throw err;
			});
		},
		async deleteUser(parent, data, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await deleteUserHandler(user.id);
		}
	},
	User: {
		async folders(parent, args, { Folder }, info) {
			return await Folder.find({ user: parent.id, public: true });
		}
	}
};
