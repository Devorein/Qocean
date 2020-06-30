const fs = require('fs');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');
const { UserModel } = require('../models/User');

async function updateUserDetailsHandler(body, userId) {
	const updateFields = {};
	Object.keys(body).forEach((key) => {
		updateFields[key] = body[key];
	});
	return await UserModel.findByIdAndUpdate(userId, updateFields, {
		new: true,
		runValidators: true
	});
}

exports.updateUserDetailsHandler = updateUserDetailsHandler;

async function updateUserPasswordHandler(userId, { currentPassword, newPassword }, next) {
	const user = await UserModel.findById(userId).select('+password');

	// Check current password
	const doesPassMatch = await user.matchPassword(currentPassword);
	if (!doesPassMatch) return next(new ErrorResponse(`Password is incorrect`, 401));

	user.password = newPassword;
	await user.save();
	return await sendTokenResponse(user);
}
exports.updateUserPasswordHandler = updateUserPasswordHandler;

async function deleteUserHandler(userId) {
	const user = await UserModel.findById(userId);
	if (!user.image.startsWith('http') && user.image !== 'none.png' && user.image !== '')
		fs.unlinkSync(path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${user.image}`));
	return await user.remove();
}
exports.deleteUserHandler = deleteUserHandler;

async function getUsersTagsHandler(filter, config = {}) {
	const {
		uniqueWithoutColor = false,
		originalWithoutColor = false,
		uniqueWithColor = false,
		originalWithColor = false
	} = config;

	const tags = [];
	const users = await UserModel.find(filter).select('quizzes').populate({ path: 'quizzes', select: 'tags' });
	users.forEach((user) => user.quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.push(tag))));
	const noncolouredTags = tags.map((tag) => tag.split(':')[0]);
	return {
		uniqueWithoutColor: uniqueWithoutColor ? Array.from(new Set(noncolouredTags)) : [],
		uniqueWithColor: uniqueWithColor ? Array.from(new Set(tags)) : [],
		originalWithoutColor: originalWithoutColor ? noncolouredTags : [],
		originalWithColor: originalWithColor ? tags : []
	};
}

exports.getUsersTagsHandler = getUsersTagsHandler;
