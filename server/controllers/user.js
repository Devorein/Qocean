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

async function updateUserDetailsHandler(body, userId) {
	const updateFields = {
		name: body.name,
		email: body.email,
		username: body.username,
		image: body.image
	};
	return await User.findByIdAndUpdate(userId, updateFields, {
		new: true,
		runValidators: true
	});
}

exports.updateUserDetailsHandler = updateUserDetailsHandler;
exports.updateUserDetails = asyncHandler(async function(req, res, next) {
	const user = await updateUserDetailsHandler(req.body, req.user._id);
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

async function updateUserPasswordHandler(userId, { currentPassword, newPassword }, next) {
	const user = await User.findById(userId).select('+password');

	// Check current password
	const doesPassMatch = await user.matchPassword(currentPassword);
	if (!doesPassMatch) return next(new ErrorResponse(`Password is incorrect`, 401));

	user.password = newPassword;
	await user.save();
	return await sendTokenResponse(user);
}

// @desc     Update current user password
// @route    PUT /api/v1/users/updatePassword
// @access   Private
exports.updateUserPassword = asyncHandler(async function(req, res, next) {
	const { token, id } = await updateUserPasswordHandler(req.user._id, req.body, next);
	res.status(200).json({ token, id });
});

exports.updateUserPasswordHandler = updateUserPasswordHandler;

async function deleteUserHandler(userId) {
	const user = await User.findById(userId);
	if (!user.image.startsWith('http') && user.image !== 'none.png' && user.image !== '')
		fs.unlinkSync(path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${user.image}`));
	return await user.remove();
}

// @desc     Delete current user
// @route    DELETE /api/v1/users
// @access   Private
exports.deleteUser = asyncHandler(async function(req, res, next) {
	const user = await deleteUserHandler(req.user._id);
	res.status(200).json({
		success: true,
		data: user
	});
});

exports.deleteUserHandler = deleteUserHandler;

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

async function getUserTagsHandler(userId, config = {}, next, useUser = false) {
	const user = useUser
		? userId
		: await User.findById(userId).select('_id,quizzes').populate({ path: 'quizzes', select: 'tags' });
	if (!user) return next(new ErrorResponse(`User not found`, 404));
	const {
		uniqueWithoutColor = false,
		originalWithoutColor = false,
		uniqueWithColor = false,
		originalWithColor = false
	} = config;

	const tags = [];
	user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag)));
	const noncolouredTags = tags.map((tag) => tag.split(':')[0]);
	return {
		uniqueWithoutColor: uniqueWithoutColor ? Array.from(new Set(noncolouredTags)) : [],
		uniqueWithColor: uniqueWithColor ? Array.from(new Set(tags)) : [],
		originalWithoutColor: originalWithoutColor ? noncolouredTags : [],
		originalWithColor: originalWithColor ? tags : []
	};
}

exports.getUserTagsHandler = getUserTagsHandler;

exports.getUserTags = asyncHandler(async (req, res, next) => {
	const data = await getUserTagsHandler(req.params.id, req.body, next);
	res.status(200).json({
		success: true,
		data
	});
});

async function getAllUserTagsHandler() {
	const users = await User.find({}).select('quizzes').populate({ path: 'quizzes', select: 'tags' });
	const tags = [];
	users.forEach((user) => {
		user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag.split(':')[0])));
	});
	return Array.from(new Set(tags));
}

exports.getAllUserTagsHandler = getAllUserTagsHandler;

exports.getAllTags = asyncHandler(async (req, res, next) => {
	const data = await getAllUserTagsHandler();
	res.status(200).json({
		success: true,
		data
	});
});

exports.getMyTags = asyncHandler(async (req, res, next) => {
	const data = await getUserTagsHandler(req.user._id, req.body, next);
	res.status(200).json({
		success: true,
		data
	});
});
