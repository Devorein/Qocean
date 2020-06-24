const Folder = require('../models/Folder');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');
const addRatings = require('../utils/addRatings');

// @desc: Create single folder
// @route: POST /api/v1/folders
// @access: Private

async function createFolderHandler(userId, data, next) {
	data.user = userId;
	const prevFolder = await Folder.countDocuments({ name: data.name, user: userId });
	if (prevFolder >= 1) return next(new ErrorResponse(`You alread have a folder named ${data.name}`, 400));
	const targetQuizzes = data.quizzes;
	delete data.quizzes;
	const folder = await Folder.create(data);
	if (targetQuizzes) await folder.quiz(1, targetQuizzes);
	return await folder.save();
}

exports.createFolderHandler = createFolderHandler;
exports.createFolder = asyncHandler(async (req, res, next) => {
	const folder = await createFolderHandler(req.user._id, req.body, next);
	res.status(201).json({ success: true, data: folder });
});

// @desc: Update single folder
// @route: PUT /api/v1/folders/:id
// @access: Private
exports.updateFolder = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const folder = await updateResource(Folder, req.body, req.user._id, next);
	res.status(200).json({ success: true, data: folder });
});

exports.updateFolders = asyncHandler(async (req, res, next) => {
	const folders = await updateResource('folder', req.body.data, req.user, next);
	res.status(200).json({ success: true, data: folders });
});

async function deleteFolderHandler(folderIds, userId, next) {
	const deleted_folders = [];
	for (let i = 0; i < folderIds.length; i++) {
		const folderId = folderIds[i];
		const folder = await Folder.findById(folderId);
		if (!folder) return next(new ErrorResponse(`Folder not found with id of ${folderId}`, 404));
		if (folder.user.toString() !== userId.toString())
			return next(new ErrorResponse(`User not authorized to delete folder`, 401));
		await folder.remove();
		deleted_folders.push(folder);
	}
	return deleted_folders;
}

exports.deleteFolderHandler = deleteFolderHandler;
// @desc: Delete single folder
// @route: DELETE /api/v1/folders/:id
// @access: Private
exports.deleteFolder = asyncHandler(async (req, res, next) => {
	const folders = await deleteFolderHandler([ req.params.id ], req.user._id, next);
	res.status(200).json({ success: true, data: folders });
});

exports.deleteFolders = asyncHandler(async (req, res, next) => {
	const folders = await deleteFolderHandler(req.body.ids, req.user._id, next);
	res.status(200).json({ success: true, data: folders.length });
});

// @desc: Add/remove quiz from folder
// @route: PUT /api/v1/folders/quiz
// @access: Private
exports.quizToFolder = asyncHandler(async (req, res, next) => {
	const { op } = req.body;
	const quiz = await Quiz.findById(req.body.quiz);
	if (!quiz) return next(new ErrorResponse(`No quiz found with id ${req.body.quiz}`, 404));
	const folder = await Folder.findById(req.body.folder);
	if (!quiz) return next(new ErrorResponse(`No folder found with id ${req.body.folder}`, 404));
	if (op !== 1 && op !== 0) return next(new ErrorResponse(`Wrong operation on folder`, 404));
	await folder.quiz(op, req.body.quiz);
	await folder.save();
	res.status(200).json({ success: true, data: folder });
});

exports.updateFolderRatings = asyncHandler(async (req, res, next) => {
	const ratingsData = await addRatings(Folder, req.body.data, req.user._id, next);
	res.status(200).json({ success: true, ratingsData });
});

exports.watchFolders = asyncHandler(async (req, res, next) => {
	const manipulated = await watchAction('folders', req.body, req.user);
	res.status(200).json({ success: true, data: manipulated });
});
