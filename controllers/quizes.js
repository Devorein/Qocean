const path = require('path');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all quizes
// @route: GET /api/v1/quizes
exports.getQuizes = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc: Get single quiz
// @route: GET /api/v1/quizes/:id
exports.getQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Create single quiz
// @route: POST /api/v1/quizes/:id
exports.createQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.create(req.body);
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizes/:id
exports.updateQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Delete single quiz
// @route: DELETE /api/v1/quizes/:id
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	await quiz.remove();
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Upload a single quiz photo
// @route: PUT /api/v1/quizes/:id/photo
// @access: Private
exports.quizPhotoUpload = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));
	const { file } = req.files;

	if (!file.mimetype.startsWith('image/')) return next(new ErrorResponse(`Please upload an image file`, 400));

	if (file.size > process.env.FILE_UPLOAD_SIZE)
		return next(new ErrorResponse(`Photo larger than ${process.env.FILE_UPLOAD_SIZE / 1000000}mb`, 400));

	file.name = `quiz_${quiz._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) return next(new ErrorResponse(`Problem with file upload`, 500));
		await Quiz.findByIdAndUpdate(quiz._id, {
			image: file.name
		});
		res.status(200).json({ success: true, data: file.name });
	});
});
