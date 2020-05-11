const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all questions
// @route: GET /api/v1/questions
// @route: GET /api/v1/quizes/:quizId/questions
// @access: Public

exports.getQuestions = asyncHandler(async function(req, res, next) {
	let query;

	if (req.params.quizId) query = Question.find({ quiz: req.params.quizId });
	else
		query = Question.find().populate({
			path: 'quiz',
			select: 'name'
		});
	const questions = await query;
	res.status(200).json({ success: true, count: questions.length, data: questions });
});

// @desc: Get a question
// @route: GET /api/v1/questions/:id
// @access: Public

exports.getQuestion = asyncHandler(async function(req, res, next) {
	const question = await Question.findById(req.params.id).populate({
		path: 'quiz',
		select: 'name'
	});
	res.status(200).json({ success: true, data: question });
});

// @desc: Create a question
// @route: GET /api/v1/quizes/:quizId/questions
// @access: Private
// ! Validators for each question type needs to be done

exports.createQuestion = asyncHandler(async function(req, res, next) {
	req.body.quiz = req.params.quizId;
	const quiz = await Quiz.findById(req.params.quizId);
	if (!quiz) return next(new ErrorResponse(`No quiz with the id ${id} found`, 404));

	const question = await Question.create(req.body);
	res.status(200).json({ success: true, data: question });
});

// @desc: Update a question
// @route: PUT /api/v1/questions/:id
// @access: Private
// ! Validators for each question type needs to be done

exports.updateQuestion = asyncHandler(async function(req, res, next) {
	let question = await Question.findById(req.params.id);
	if (!question) return next(new ErrorResponse(`No question with id ${req.params.id} exists`, 404));
	question = await Question.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({ success: true, data: question });
});
