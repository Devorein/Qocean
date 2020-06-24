const Folder = require('../models/Folder');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');

// @desc: Create single folder
// @route: POST /api/v1/folders
// @access: Private
exports.createFolder = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const prevFolder = await Folder.countDocuments({ name: req.body.name, user: req.user._id });
	if (prevFolder >= 1) return next(new ErrorResponse(`You alread have a folder named ${req.body.name}`, 400));
	const targetQuizzes = req.body.quizzes;
	delete req.body.quizzes;
	const folder = await Folder.create(req.body);
	if (targetQuizzes) await folder.quiz(1, targetQuizzes);
	await folder.save();
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

// @desc: Delete single folder
// @route: DELETE /api/v1/folders/:id
// @access: Private
exports.deleteFolder = asyncHandler(async (req, res, next) => {
	const folder = await Folder.findById(req.params.id).select('name user');
	if (!folder) return next(new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404));
	if (folder.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete folder`, 401));
	await folder.remove();
	res.status(200).json({ success: true, data: folder });
});

exports.deleteFolders = asyncHandler(async (req, res, next) => {
	const { folders } = req.body;
	for (let i = 0; i < folders.length; i++) {
		const folderId = folders[i];
		const folder = await Folder.findById(folderId).select('name user');
		if (!folder) return next(new ErrorResponse(`Folder not found with id of ${folderId}`, 404));
		if (folder.user.toString() !== req.user._id.toString())
			return next(new ErrorResponse(`User not authorized to delete folder`, 401));
		await folder.remove();
	}
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

exports.watchFolders = asyncHandler(async (req, res, next) => {
	const manipulated = await watchAction('folders', req.body, req.user);
	res.status(200).json({ success: true, data: manipulated });
});