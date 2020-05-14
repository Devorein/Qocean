const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Create a question
// @route: POST /api/v1/quizes
// @access: Private
// ! Validators for each question type needs to be done

exports.createQuestion = asyncHandler(async function(req, res, next) {
	if (!req.body.quiz) return next(new ErrorResponse(`Provide the quiz id`, 400));
	const quiz = await Quiz.findById(req.body.quiz);
	if (!quiz) return next(new ErrorResponse(`No quiz with the id ${id} found`, 404));
	if (quiz.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to add a question to this quiz`, 401));

	req.body.user = req.user._id;
	const question = await Question.create(req.body);
	res.status(200).json({ success: true, data: question });
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
	question = await Question.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({ success: true, data: question });
});

// @desc: Delete a question
// @route: DELETE /api/v1/questions/:id
// @access: Private
// ! Validators for each question type needs to be done
// ! Batch Delete questions
exports.deleteQuestion = asyncHandler(async function(req, res, next) {
	let question = await Question.findById(req.params.id).select('question user type');
	if (!question) return next(new ErrorResponse(`No question with id ${req.params.id} exists`, 404));
	if (question.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete question`, 401));
	question = await question.remove();
	res.status(200).json({ success: true, data: question });
});

// @desc: Upload a single question photo
// @route: PUT /api/v1/questions/:id/photo
// @access: Private
exports.questionPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});
