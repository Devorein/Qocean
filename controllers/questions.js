const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const path = require('path');

exports.sendAnswer = asyncHandler(async (req, res, next) => {
	const question = await Question.findOne({ _id: req.params.id, user: req.user._id }).select('+answers');
	if (!question) return next(new ErrorResponse(`Question doesnt exist`, 400));
	res.status(200).json({ success: true, data: question.answers });
});

exports.validateQuestion = asyncHandler(async (req, res, next) => {
	const question = await Question.findById(req.body.id).select('+answers');
	if (!question) return next(new ErrorResponse(`Question doesn't exist`, 404));
	if (!req.body.answers) return next(new ErrorResponse(`Provide the answers`, 400));
	const [ isCorrect, message ] = await question.validateAnswer(req.body.answers);
	res.status(200).json({ success: true, isCorrect, message });
});

exports.validateQuestions = asyncHandler(async (req, res, next) => {
	const { questions } = req.body;
	const response = { correct: 0, incorrect: 0 };
	for (let i = 0; i < questions.length; i++) {
		const { id, answers } = questions[i];
		const question = await Question.findById(id).select('+answers');
		if (question) {
			let [ isCorrect ] = await question.validateAnswer(answers);
			if (isCorrect) response.correct++;
			else response.incorrect++;
		}
	}
	res.status(200).json({ success: true, data: response });
});

// @desc: Create a question
// @route: POST /api/v1/quizzes
// @access: Private
// ! Validators for each question type needs to be done

exports.createQuestion = asyncHandler(async function(req, res, next) {
	if (!req.body.quiz) return next(new ErrorResponse(`Provide the quiz id`, 400));
	const quiz = await Quiz.findById(req.body.quiz);
	if (!quiz) return next(new ErrorResponse(`No quiz with the id ${req.body.quiz} found`, 404));
	if (quiz.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to add a question to this quiz`, 401));
	const [ isValidQuestion, message ] = await Question.validateQuestion(req.body);
	if (isValidQuestion) {
		req.body.user = req.user._id;
		const question = await Question.create(req.body);
		res.status(200).json({ success: true, data: question });
	} else return next(new ErrorResponse(message, 401));
});

// @desc: Update a question
// @route: PUT /api/v1/questions/:id
// @access: Private
// ! Validators for each question type needs to be done
// ! Batch Update questions
exports.updateQuestion = asyncHandler(async function(req, res, next) {
	let question = await Question.findById(req.params.id);
	if (!question) return next(new ErrorResponse(`No question with id ${req.params.id} exists`, 404));
	if (question.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to update question`, 401));
	req.body.updated_at = Date.now();
	question = await Question.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	const quiz = await Quiz.findOne(question.quiz);
	quiz.updated_at = Date.now();
	await quiz.save();
	res.status(200).json({ success: true, data: question });
});

// @desc: Delete a question
// @route: DELETE /api/v1/questions/:id
// @access: Private
// ! Validators for each question type needs to be done
// ! Batch Delete questions
exports.deleteQuestion = asyncHandler(async function(req, res, next) {
	let question = await Question.findById(req.params.id).select('question user type image');
	if (!question) return next(new ErrorResponse(`No question with id ${req.params.id} exists`, 404));
	if (question.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete question`, 401));
	if (!question.image.startsWith('http') || question.image !== 'none.png')
		fs.unlinkSync(path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${question.image}`));
	question = await question.remove();
	res.status(200).json({ success: true, data: question });
});

// @desc: Upload a single question photo
// @route: PUT /api/v1/questions/:id/photo
// @access: Private
exports.questionPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});
