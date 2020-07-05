const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { UserModel } = require('../models/User');
const colors = require('colors');

exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
		token = req.headers.authorization.split(' ')[1];
	// else if(req.cookies.token) token = req.cookies.token
	if (!token) return next(new ErrorResponse('Not authorized to access this route', 401));

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await UserModel.findById(decoded.id);
		next();
	} catch (err) {
		return next(new ErrorResponse('Not authorized to access this route', 401));
	}
});

exports.validate = asyncHandler(async (req, res, next) => {
	const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
	if (token) {
		try {
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			req.user = await UserModel.findById(decoded.id);
			if (req.user) req.user.id = req.user._id;
			else console.log('Unauth mode');
		} catch (err) {
			console.log(colors.red(err.message));
		}
	}
	next();
});
