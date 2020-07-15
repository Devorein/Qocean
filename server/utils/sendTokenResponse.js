module.exports = (user) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true
	};
	if (process.env.NODE_ENV === 'production') options.secure = true;
	return { token, id: user._id };
};
