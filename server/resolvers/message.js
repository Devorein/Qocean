module.exports = {
	Message: {
		async user(parent, args, { User }) {
			return await User.findById(parent.user);
		},
		async sentUser(parent, args, { User }) {
			return await User.findById(parent.sentUser).select('-reports -inbox -filtersort -watchlist');
		}
	}
};
