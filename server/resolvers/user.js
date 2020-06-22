const parsePagination = require('../utils/parsePagination');

module.exports = {
	Query: {
		async getPublicUsers(parent, { pagination }, { User }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			const users = await User.find(JSON.strin(filter)).sort(sort).skip(page).limit(limit);
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
		}
	},
	PublicUser: {
		async folders(parent, args, { Folder }, info) {
			return await Folder.find({ user: parent.id, public: true });
		}
	}
};
