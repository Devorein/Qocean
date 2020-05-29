const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendTokenResponse = require('../utils/sendTokenResponse');

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
	const user = await User.findById(req.user._id).populate([
		{
			path: 'quizzes',
			select: 'name'
		},
		{
			path: 'current_environment',
			select: '-created_at -favourite -public -user -__v'
		}
	]);
	res.status(200).json({
		success: true,
		data: user
	});
});

exports.getUserTags = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).populate({ path: 'quizzes', select: 'tags' });
	if (!user) return next(new ErrorResponse(`User not found`, 404));
	const tags = [];
	user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag.split(':')[0])));
	res.status(200).json({
		success: true,
		data: Array.from(new Set(tags))
	});
});
