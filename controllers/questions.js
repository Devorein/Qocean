const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all questions
// @route: GET /api/v1/questions
// @route: GET /api/v1/quizes/:quizId/questions
// @access: Public

exports.getQuestions = asyncHandler(async function(req, res, next) {
	let query;

	if (req.params.quizId) query = Question.find({ quiz: req.params.quizId });
	else query = Question.find();
	const questions = await query;
	res.status(200).json({ success: true, count: questions.length, data: questions });
});
