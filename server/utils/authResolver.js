const isAuthenticated = () => (next) => async (root, args, context, info) => {
	if (!context.user) {
		throw new Error('You are not authenticated!');
	}

	return next(root, args, context, info);
};

module.exports = isAuthenticated;
