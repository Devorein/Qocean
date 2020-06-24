const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const path = require('path');
const updateResource = require('../utils/updateResource');

exports.sendAnswer = asyncHandler(async (req, res, next) => {
	const question = await Question.findOne({ _id: req.params.id, user: req.user._id }).select('+answers');
	if (!question) return next(new ErrorResponse(`Question doesnt exist`, 400));
	res.status(200).json({ success: true, data: question.answers });
});

exports.sendAnswers = asyncHandler(async (req, res, next) => {
	const { questions } = req.body;
	const responses = [];
	for (let i = 0; i < questions.length; i++) {
		const questionId = questions[i];
		const { _id, answers } = await Question.findById(questionId).select('+answers');
		responses.push({ _id, answers });
	}
	res.status(200).json({ success: true, data: responses });
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
	const response = { correct: [], incorrect: [] };
	for (let i = 0; i < questions.length; i++) {
		const { id, answers } = questions[i];
		const question = await Question.findById(id).select('+answers');
		if (question) {
			let [ isCorrect ] = await question.validateAnswer(answers);
			if (isCorrect) response.correct.push(id);
			else response.incorrect.push(id);
		}
	}
	res.status(200).json({ success: true, data: response });
});

// @desc: Create a question
// @route: POST /api/v1/questions
// @access: Private

async function createQuestionHandler(body, userId, next) {
	if (!body.quiz) return next(new ErrorResponse(`Provide the quiz id`, 400));
	const quiz = await Quiz.findById(body.quiz);
	if (!quiz) return next(new ErrorResponse(`No quiz with the id ${body.quiz} found`, 404));
	if (quiz.user.toString() !== userId.toString())
		return next(new ErrorResponse(`User not authorized to add a question to this quiz`, 401));
	const [ isValidQuestion, message ] = await Question.validateQuestion(body);
	if (isValidQuestion) {
		body.user = userId;
		const question = await Question.create(body);
		return question;
	} else return next(new ErrorResponse(message, 401));
}

exports.createQuestionHandler = createQuestionHandler;
exports.createQuestion = asyncHandler(async function(req, res, next) {
	const question = await createQuestionHandler(req.body, req.user._id, next);
	res.status(200).json({ success: true, data: question });
});

// @desc: Update a question
// @route: PUT /api/v1/questions/:id
// @access: Private

exports.getOthersQuestions = asyncHandler(async function(req, res, next) {
	const page = parseInt(req.body.page) || 1;
	const limit = parseInt(req.body.limit) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const sort = {};
	if (req.body.sort) {
		req.body.sort.split(',').forEach((field) => {
			const isDescending = field.startsWith('-');
			if (isDescending) sort[field.replace('-', '')] = -1;
			else sort[field] = 1;
		});
	} else {
		sort.created_at = -1;
		sort.name = -1;
	}

	const questions = await Question.aggregate([
		{
			$match: {
				...req.body.filters,
				user: { $ne: req.user._id },
				public: true
			}
		},
		{ $project: { public: 0, favourite: 0, answers: 0 } },
		{
			$lookup: {
				from: 'quizzes',
				let: { quizId: '$quiz' },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [ { $eq: [ '$_id', '$$quizId' ] }, { $eq: [ '$public', true ] } ]
							}
						}
					},
					{
						$project: {
							name: 1
						}
					}
				],
				as: 'quiz'
			}
		},
		{ $unwind: '$quiz' },
		{
			$sort: sort
		}
	]);
	const total = questions.length;
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		};
	}
	const resquestion = [];
	res.advancedResults = {
		success: true,
		count: questions.length,
		pagination,
		data: resquestion
	};
	for (let i = startIndex; i < Math.min(endIndex, questions.length); i++) {
		resquestion.push(questions[i]);
	}
	res.status(200).json(res.advancedResults);
});

exports.updateQuestion = asyncHandler(async function(req, res, next) {
	req.body.id = req.params.id;
	const question = await updateResource(Question, req.body, req.user._id, next);
	res.status(200).json({ success: true, data: question });
});

exports.updateQuestions = asyncHandler(async (req, res, next) => {
	const questions = await updateResource(Question, req.body.data, req.user._id, next);
	res.status(200).json({ success: true, data: questions });
});

// @desc: Delete a question
// @route: DELETE /api/v1/questions/:id
// @access: Private

async function deleteQuestionHandler(questionIds, userId, next) {
	const deleted_questions = [];
	for (let i = 0; i < questionIds.length; i++) {
		const questionId = questionIds[i];
		const question = await Question.findById(questionId);
		if (!question) return next(new ErrorResponse(`Question not found with id of ${questionId}`, 404));
		if (question.user.toString() !== userId.toString())
			return next(new ErrorResponse(`User not authorized to delete question`, 401));
		if (question.image && (!question.image.match(/^(http|data:)/) && question.image !== 'none.png')) {
			const location = path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${question.image}`);
			if (fs.existsSync(location)) fs.unlinkSync(location);
		}
		await question.remove();
		deleted_questions.push(question);
	}
	return deleted_questions;
}

exports.deleteQuestionHandler = deleteQuestionHandler;

exports.deleteQuestion = asyncHandler(async function(req, res, next) {
	const [ question ] = await deleteQuestionHandler([ req.params.id ], req.user._id, next);
	res.status(200).json({ success: true, data: question });
});

exports.deleteQuestions = asyncHandler(async function(req, res, next) {
	const questions = await deleteQuestionHandler(req.body.data, req.user._id, next);
	res.status(200).json({ success: true, data: questions });
});

// @desc: Upload a single question photo
// @route: PUT /api/v1/questions/:id/photo
// @access: Private
exports.questionPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});
