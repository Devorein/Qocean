const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendTokenResponse = require('../utils/sendTokenResponse');
const populateQuery = require('../utils/populateQuery');
const fs = require('fs');
const path = require('path');

// @desc     Update current user details
// @route    PUT /api/v1/users/updateDetails
// @access   Private
exports.updateUserDetails = asyncHandler(async function(req, res, next) {
	const updateFields = {
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		image: req.body.image
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

// @desc: Upload user photo
// @route: PUT /api/v1/users/:id/photo
// @access: Private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find({}).select('username');
	res.status(200).json({ success: true, data: users });
});

// @desc     Update current user password
// @route    PUT /api/v1/users/updatePassword
// @access   Private
exports.updateUserPassword = asyncHandler(async function(req, res, next) {
	const user = await User.findById(req.user.id).select('+password');

	// Check current password
	const doesPassMatch = await user.matchPassword(req.body.currentPassword);
	if (!doesPassMatch) return next(new ErrorResponse(`Password is incorrect`, 401));

	user.password = req.body.newPassword;
	await user.save();
	sendTokenResponse(user, 200, res);
});

// @desc     Delete current user
// @route    DELETE /api/v1/users
// @access   Private
exports.deleteUser = asyncHandler(async function(req, res, next) {
	const user = await User.findById(req.user._id);
	if (!user.image.startsWith('http') || user.image !== 'none.png')
		fs.unlinkSync(path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${user.image}`));
	await user.remove();
	res.status(200).json({
		success: true,
		data: user
	});
});

// @desc     Get current user
// @route    GET /api/v1/users/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const query = User.findById(req.user._id);
	populateQuery(query, req);
	const user = await query;
	res.status(200).json({
		success: true,
		data: user
	});
});

exports.getUserTags = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).select('_id,quizzes').populate({ path: 'quizzes', select: 'tags' });
	if (!user) return next(new ErrorResponse(`User not found`, 404));
	const tags = [];
	user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag)));
	res.status(200).json({
		success: true,
		data: Array.from(new Set(tags))
	});
});

exports.getAllTags = asyncHandler(async (req, res, next) => {
	const users = await User.find({}).select('quizzes').populate({ path: 'quizzes', select: 'tags' });
	const tags = [];
	users.forEach((user) => {
		user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag.split(':')[0])));
	});
	res.status(200).json({
		success: true,
		data: Array.from(new Set(tags))
	});
});

exports.getMyTags = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id).select('_id,quizzes').populate({ path: 'quizzes', select: 'tags' });
	const {
		uniqueWithoutColor = false,
		originalWithoutColor = false,
		uniqueWithColor = false,
		originalWithColor = false
	} = req.body;

	if (!user) return next(new ErrorResponse(`User not found`, 404));
	const tags = [];
	user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag)));
	const noncolouredTags = tags.map((tag) => tag.split(':')[0]);

	res.status(200).json({
		success: true,
		data: {
			uniqueWithoutColor: uniqueWithoutColor ? Array.from(new Set(noncolouredTags)) : [],
			uniqueWithColor: uniqueWithColor ? Array.from(new Set(tags)) : [],
			originalWithoutColor: originalWithoutColor ? noncolouredTags : [],
			originalWithColor: originalWithColor ? tags : []
		}
	});
});
