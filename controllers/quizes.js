const path = require('path');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all quizes
// @route: GET /api/v1/quizes
// @access: Public
exports.getQuizes = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc: Get single quiz
// @route: GET /api/v1/quizes/:id
// @access: Public
exports.getQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Create single quiz
// @route: POST /api/v1/quizes/:id
// @access: Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const quiz = await Quiz.create(req.body);
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizes/:id
// @access: Private
exports.updateQuiz = asyncHandler(async (req, res, next) => {
	let quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	if (quiz.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to update this quiz`, 401));
	quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Delete single quiz
// @route: DELETE /api/v1/quizes/:id
// @access: Private
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	if (quiz.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete quiz`, 401));
	await quiz.remove();
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Upload a single quiz photo
// @route: PUT /api/v1/quizes/:id/photo
// @access: Private
exports.quizPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});
