module.exports = {
	Query: {
		async getPublicUsers(parent, args, { User }) {
			const users = await User.find({});
			return users;
		},

		async getAllPublicUsersUsername(parent, args, { User }) {
			const users = await User.find({}).select('username');
			return users;
		},

		async getAllPublicUsers(parent, args, { User }) {
			const users = await User.find({});
			return users;
		}
	}
};
