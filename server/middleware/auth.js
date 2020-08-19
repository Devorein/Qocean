const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const { UserModel } = require('../schemas/User');
const colors = require('colors');

exports.validate = asyncHandler(async (req, res, next) => {
	const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await UserModel.findById(decoded.id);
			if (req.user) req.user.id = req.user._id;
			else console.log('Unauth mode');
		} catch (err) {
			console.log(colors.red(err.message));
		}
	}
	next();
});
