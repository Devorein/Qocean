const Quiz = require('../models/Quiz');
const Folder = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Create single quiz
// @route: POST /api/v1/quizzes
// @access: Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const prevQuiz = await Quiz.countDocuments({ name: req.body.name, user: req.user._id });
	if (prevQuiz >= 1) return next(new ErrorResponse(`You already have a quiz named ${req.body.name}`, 400));
	const targetQuizs = req.body.quizs;
	delete req.body.quizs;
	const quiz = await Quiz.create(req.body);
	if (targetQuizs) {
		const quizsPromise = [];
		for (let i = 0; i < targetQuizs.length; i++) {
			const quizId = targetQuizs[i];
			quizsPromise.push(Quiz.findById(quizId));
		}
		try {
			const quizs = await Promise.all(quizsPromise);
			for (let i = 0; i < quizs.length; i++) {
				const quiz = quizs[i];
				await quiz.quiz(1, quiz._id);
				await quiz.save();
			}
		} catch (err) {
			return next(new ErrorResponse(err), 404);
		}
	}
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizzes/:id
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
// @route: DELETE /api/v1/quizzes/:id
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
// @route: PUT /api/v1/quizzes/:id/photo
// @access: Private
exports.quizPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});
