const Question = require('../models/Question');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/updateResource');

const {
	createQuestionHandler,
	deleteQuestionHandler,
	validateQuestionHandler,
	sendAnswerHandler,
	getOthersQuestionsHandler
} = require('../handlers/question');

exports.sendAnswer = asyncHandler(async (req, res, next) => {
	const [ answers ] = await sendAnswerHandler([ req.params.id ]);
	res.status(200).json({ success: true, data: answers });
});

exports.sendAnswers = asyncHandler(async (req, res, next) => {
	const answers = await sendAnswerHandler(req.body.ids, next);
	res.status(200).json({ success: true, data: answers });
});

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
