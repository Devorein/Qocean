const path = require('path');
const fs = require('fs');

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');

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

async function createQuestionHandler(
	body,
	userId,
	next = (err) => {
		throw err;
	}
) {
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
