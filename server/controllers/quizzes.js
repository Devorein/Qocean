const { QuizModel } = require('../models/Quiz');

const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/resource/updateResource');
const watchAction = require('../utils/resource/watchAction');
const addRatings = require('../utils/resource/addRatings');

const {
	createQuizHandler,
	deleteQuizHandler,
	updatePlayedTimesHandler
} = require('../handlers/quiz');

// @desc: Create single quiz
// @route: POST /api/v1/quizzes
// @access: Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await createQuizHandler(req.user._id, req.body, next);
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizzes/:id
// @access: Private

exports.updateQuiz = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const [quiz] = await updateResource(
		QuizModel,
		[req.body],
		req.user._id,
		next
	);
	res.status(200).json({ success: true, data: quiz });
});

exports.updateQuizzes = asyncHandler(async (req, res, next) => {
	const quizzes = await updateResource(
		QuizModel,
		req.body.data,
		req.user._id,
		next
	);
	res.status(200).json({ success: true, data: quizzes });
});

// @desc: Delete single quiz
// @route: DELETE /api/v1/quizzes/:id
// @access: Private

exports.deleteQuiz = asyncHandler(async (req, res, next) => {
	const [quiz] = await deleteQuizHandler([req.params.id], req.user._id, next);
	res.status(200).json({ success: true, data: quiz });
});

exports.deleteQuizzes = asyncHandler(async (req, res, next) => {
	const quizzes = await deleteQuizHandler(req.body.data, req.user._id, next);
	res.status(200).json({ success: true, data: quizzes });
});

// @desc: Upload a single quiz photo
// @route: PUT /api/v1/quizzes/:id/photo
// @access: Private
exports.quizPhotoUpload = asyncHandler(async (req, res) => {
	res.status(200).json(res.imageUpload);
});

exports.updatePlayedTimes = asyncHandler(async (req, res) => {
	const total_updated = await updatePlayedTimesHandler(req.body, req.user._id);
	res.status(200).json({ success: true, total_updated });
});

exports.updateQuizRatings = asyncHandler(async (req, res, next) => {
	const ratingsData = await addRatings(
		QuizModel,
		req.body.data,
		req.user._id,
		next
	);
	res.status(200).json({ success: true, ratingsData });
});

exports.playPageQuiz = asyncHandler(async (req, res) => {
	const quizzes = await QuizModel.find({ user: req.user._id })
		.populate({
			path: 'questions',
			select: 'difficulty time_allocated name type'
		})
		.select('name questions');
	res.status(200).json({ success: true, data: quizzes });
});

exports.watchQuizzes = asyncHandler(async (req, res) => {
	const manipulated = await watchAction('quizzes', req.body, req.user);
	res.status(200).json({ success: true, data: manipulated });
});
