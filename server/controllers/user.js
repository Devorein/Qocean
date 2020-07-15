const { UserModel } = require('../models/User');
const asyncHandler = require('../middleware/async');
const populateQuery = require('../utils/populateQuery');

const {
	updateUserDetailsHandler,
	updateUserPasswordHandler,
	deleteUserHandler,
	getUsersTagsHandler
} = require('../handlers/user');
// @desc     Update current user details
// @route    PUT /api/v1/users/updateDetails
// @access   Private
exports.updateUserDetails = asyncHandler(async function (req, res) {
	const user = await updateUserDetailsHandler(req.body, req.user._id);
	res.status(200).json({
		success: true,
		data: user
	});
});

// @desc: Upload user photo
// @route: PUT /api/v1/users/:id/photo
// @access: Private
exports.userPhotoUpload = asyncHandler(async (req, res) => {
	res.status(200).json(res.imageUpload);
});

exports.getAllUsers = asyncHandler(async (req, res) => {
	const users = await UserModel.find({}).select('username');
	res.status(200).json({ success: true, data: users });
});

// @desc     Update current user password
// @route    PUT /api/v1/users/updatePassword
// @access   Private
exports.updateUserPassword = asyncHandler(async function (req, res, next) {
	const { token, id } = await updateUserPasswordHandler(
		req.user._id,
		req.body,
		next
	);
	res.status(200).json({ token, id });
});

// @desc     Delete current user
// @route    DELETE /api/v1/users
// @access   Private
exports.deleteUser = asyncHandler(async function (req, res) {
	const user = await deleteUserHandler(req.user._id);
	res.status(200).json({
		success: true,
		data: user
	});
});

// @desc     Get current user
// @route    GET /api/v1/users/me
// @access   Private
exports.getMe = asyncHandler(async (req, res) => {
	const query = UserModel.findById(req.user._id);
	populateQuery(query, req);
	const user = await query;
	res.status(200).json({
		success: true,
		data: user
	});
});

exports.getUserTags = asyncHandler(async (req, res) => {
	const data = await getUsersTagsHandler({ _id: req.params.id }, req.body);
	res.status(200).json({
		success: true,
		data
	});
});

exports.getAllTags = asyncHandler(async (req, res) => {
	const data = await getUsersTagsHandler({}, req.body);
	res.status(200).json({
		success: true,
		data
	});
});

exports.getMyTags = asyncHandler(async (req, res, next) => {
	const data = await getUsersTagsHandler({ _id: req.user._id }, req.body, next);
	res.status(200).json({
		success: true,
		data
	});
});
