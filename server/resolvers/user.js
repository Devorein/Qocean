const parsePagination = require('../utils/parsePagination');
const {
	updateUserDetailsHandler,
	updateUserPasswordHandler,
	deleteUserHandler,
	getUserTagsHandler,
	userPhotoUpload,
	getAllUserTagsHandler
} = require('../controllers/user');

module.exports = {
	Query: {
		async getPublicUsers(parent, { pagination }, { User }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			const users = await User.find(JSON.parse(filter)).sort(sort).skip(page).limit(limit);
			return users;
		},

		async getPublicUserById(parent, { id }, { User }) {
			const user = await User.findById(id);
			return user;
		},

		async getAllPublicUsersUsername(parent, args, { User }) {
			const users = await User.find({}).select('username');
			return users;
		},

		async getAllPublicUsers(parent, args, { User }) {
			const users = await User.find({});
			return users;
		},

		async getCurrentUser(parent, args, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await User.findById(user.id);
		},

		async getUserTags(parent, { config, userId }, { User }) {
			return await getUserTagsHandler(userId, config, (err) => {
				throw err;
			});
		},

		async getMyTags(parent, { config }, { user, User }) {
			return await getUserTagsHandler(user.id, config, (err) => {
				throw err;
			});
		},

		async getAllTags(parent, { config }, { user, User }) {
			return await getAllUserTagsHandler(user.id, config, (err) => {
				throw err;
			});
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
	PublicUser: {
		async folders(parent, args, { Folder }, info) {
			return await Folder.find({ user: parent.id, public: true });
		}
	}
};
