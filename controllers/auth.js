const crypto = require('crypto');
const User = require('../models/User');
const Environment = require('../models/Environment');
const Inbox = require('../models/Inbox');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const sendTokenResponse = require('../utils/sendTokenResponse');
const { ObjectID } = require('bson');
// @desc     Register
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, version, username, image } = req.body;
	const env_id = new ObjectID();
	const inbox_id = new ObjectID();
	const data = {
		name,
		email,
		password,
		version,
		username,
		current_environment: env_id.toString()
	};
	if (image) data.image = image;
	const user = await User.create(data);
	await Environment.create({ user: user._id, _id: env_id, name: 'Default Environment' });
	await Inbox.create({ user: user._id, _id: inbox_id });
	sendTokenResponse(user, 200, res);
});

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email and password
	if (!email || !password) return next(new ErrorResponse(`Please provide an email and password`, 400));

	// Check for user
	const user = await User.findOne({ email }).select('+password');

	if (!user) return next(new ErrorResponse(`Invalid credentials`, 401));

	// Check if pass matches
	const isMatch = await user.matchPassword(password);
	if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 401));
	sendTokenResponse(user, 200, res);
});

exports.checkPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id).select('+password');
	const isMatch = await user.matchPassword(req.params.password);
	if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 400));
	else return res.status(200).send({ success: 'true', data: 'Correct password' });
});

// @desc     Logout user
// @route    GET /api/v1/auth/logout
// @access   Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});
	res.status(200).json({
		success: true,
		data: {}
	});
});

// @desc     Forgot password
// @route    GET /api/v1/auth/forgotpassword
// @access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) return next(new ErrorResponse(`There is no user with that email`, 404));

	// Get reset token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `Please make a PUT request to ${resetUrl}`;

	try {
		await sendEmail({ email: user.email, subject: 'Password reset token', message });
		res.status(200).json({ success: true, data: `Email sent` });
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorResponse(`Email couldnt be sent`, 500));
	}
});

// @desc     Rest Password
// @route    PUT /api/v1/auth/resetpassword/:resetToken
// @access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

	const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

	if (!user) return next(new ErrorResponse(`Invalid token`, 400));

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(user, 200, res);
});
