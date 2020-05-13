const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Public
exports.getUsers = asyncHandler(async function(req, res, next) {
	res.status(200).json(res.advancedResults);
});

// @desc     Get user by id
// @route    GET /api/v1/users/:userId
// @access   Public
exports.getUserById = asyncHandler(async function(req, res, next) {
	const user = await User.findById(req.params.userId);
	if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
	res.status(200).json({ success: true, data: user });
});

// @desc     Update current user
// @route    PUT /api/v1/users
// @access   Private
exports.updateUser = asyncHandler(async function(req, res, next) {
	const updateFields = {
		name: req.body.name,
		email: req.body.email,
		username: req.body.username
	};

	const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		success: true,
		data: user
	});
});

// @desc     Delete current user
// @route    DELETE /api/v1/users
// @access   Private
exports.deleteUser = asyncHandler(async function(req, res, next) {});

// @desc     Get current user
// @route    GET /api/v1/users/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	res.status(200).json({
		success: true,
		data: user
	});
});
