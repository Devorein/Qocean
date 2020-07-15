const {
	registerHandler,
	loginHandler,
	checkPasswordHandler
} = require('../handlers/auth');

module.exports = {
	Query: {
		async checkPassword(parent, { password }, { user }) {
			if (!user) throw new Error('Not authorized to access this route');
			const isMatch = await checkPasswordHandler(user.id, password, (err) => {
				throw err;
			});
			return { success: isMatch };
		}
	},
	Mutation: {
		async register(parent, { data }) {
			return registerHandler(data);
		},
		async login(parent, { data }) {
			return loginHandler(data, (err) => {
				throw err;
			});
		},
		async logout(parent, data, { res }) {
			res.cookie('token', 'none', {
				expires: new Date(Date.now() + 10 * 1000),
				httpOnly: true
			});
			return { succes: true };
		}
	}
};
