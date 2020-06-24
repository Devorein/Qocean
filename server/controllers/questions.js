const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const path = require('path');
const updateResource = require('../utils/updateResource');

async function sendAnswerHandler(ids, next) {
	const all_answers = [];
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		const { answers } = await Question.findOne({ _id: id }).select('+answers');
		if (!answers) return next(new ErrorResponse(`Question doesnt exist`, 400));
		all_answers.push({ id, answers });
	}
	return all_answers;
}

exports.sendAnswerHandler = sendAnswerHandler;
exports.sendAnswer = asyncHandler(async (req, res, next) => {
	const [ answers ] = await sendAnswerHandler([ req.params.id ]);
	res.status(200).json({ success: true, data: answers });
});

exports.sendAnswers = asyncHandler(async (req, res, next) => {
	const answers = await sendAnswerHandler(req.body.ids, next);
	res.status(200).json({ success: true, data: answers });
});

async function validateQuestionHandler(ids, next) {
	const responses = { correct: [], incorrect: [] };
	for (let i = 0; i < ids.length; i++) {
		const { id, answers } = ids[i];
		const question = await Question.findById(id).select('+answers');
		if (!answers) return next(new ErrorResponse(`Provide the answers`, 400));
		if (question) {
			let [ isCorrect ] = await question.validateAnswer(answers);
			if (isCorrect) responses.correct.push(id);
			else responses.incorrect.push(id);
		} else return next(new ErrorResponse(`Question doesn't exist`, 404));
	}
	return responses;
}

exports.validateQuestionHandler = validateQuestionHandler;

exports.validateQuestion = asyncHandler(async (req, res, next) => {
	const [ response ] = await validateQuestionHandler([ req.body.id ], next);
	res.status(200).json({ success: true, data: response });
});

exports.validateQuestions = asyncHandler(async (req, res, next) => {
	const responses = await validateQuestionHandler(req.body.ids, next);
	res.status(200).json({ success: true, data: responses });
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

async function getOthersQuestionsHandler({ filters = {}, sort, limit, page, onlyCount = false, project }) {
	const additional = [];
	if (!sort) {
		sort = {};
		sort.created_at = -1;
		sort.name = -1;
	}
	if (!project) project = { public: 0, favourite: 0, answers: 0 };
	else project.quiz = 1;

	if (page !== undefined && limit !== null) additional.push({ $skip: page });
	if (limit !== undefined && limit !== null) additional.push({ $limit: limit });

	const pipeline = [
		{
			$match: {
				...filters,
				public: true
			}
		},
		{ $project: project },
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
		{ $set: { id: '$_id' } },
		{ $unwind: '$quiz' },
		{
			$sort: sort
		},
		...additional
	];

	const questions = await Question.aggregate(pipeline);
	const total = questions.length;
	if (!onlyCount) return { total, data: questions };
	else return total;
}

exports.getOthersQuestionsHandler = getOthersQuestionsHandler;
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

	const { questions, total } = getOthersQuestionsHandler({
		filters: { ...req.body.filters, user: { $ne: req.user._id } },
		sort,
		page: startIndex,
		limit
	});

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
