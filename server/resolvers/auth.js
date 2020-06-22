const {
	registerHandler,
	loginHandler,
	forgotPassword,
	resetPassword,
	checkPasswordHandler
} = require('../controllers/auth');

module.exports = {
	Query: {
		async checkPassword(parent, { password }, ctx) {
			if (!ctx.user) throw new Error('Not authorized to access this route');
			const isMatch = await checkPasswordHandler(ctx.user.id, password, (err) => {
				throw err;
			});
			return { success: isMatch };
		}
	},
	Mutation: {
		async register(parent, { data }, ctx, info) {
			return registerHandler(data);
		},
		async login(parent, { data }, ctx, info) {
			return loginHandler(data, (err) => {
				throw err;
			});
		},
		async logout(parent, data, { res }) {
			// res.cookie('token', 'none', {
			// 	expires: new Date(Date.now() + 10 * 1000),
			// 	httpOnly: true
			// });
			return { succes: true };
		}
	}
};
