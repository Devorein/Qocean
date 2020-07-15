const fs = require('fs');
const path = require('path');

const { QuestionModel } = require('../models/Question');
const { ErrorResponse } = require('../utils/errorResponse');
const { QuizModel } = require('../models/Quiz');

async function createQuizHandler(userId, body, next) {
	body.user = userId;
	const prevQuiz = await QuizModel.countDocuments({
		name: body.name.trim(),
		user: userId
	});
	if (prevQuiz >= 1)
		return next(
			new ErrorResponse(`You already have a quiz named ${body.name}`, 400)
		);

	const [success, message] = await QuizModel.validate(body);
	if (!success) return next(new ErrorResponse(message, 400));
	return await QuizModel.create(body);
}

exports.createQuizHandler = createQuizHandler;

async function deleteQuizHandler(quizIds, userId, next) {
	const deleted_quizzes = [];
	for (let i = 0; i < quizIds.length; i++) {
		const quizId = quizIds[i];
		const quiz = await QuizModel.findById(quizId);
		if (!quiz)
			return next(
				new ErrorResponse(`Quiz not found with id of ${quizId}`, 404)
			);
		if (quiz.user.toString() !== userId.toString())
			return next(new ErrorResponse(`User not authorized to delete quiz`, 401));
		if (
			quiz.image &&
			!quiz.image.match(/^(http|data:)/) &&
			quiz.image !== 'none.png'
		) {
			const location = path.join(
				path.dirname(__dirname),
				`${process.env.FILE_UPLOAD_PATH}/${quiz.image}`
			);
			if (fs.existsSync(location)) fs.unlinkSync(location);
		}
		const { questions } = quiz;
		for (let i = 0; i < questions.length; i++) {
			const questionId = questions[i];
			const question = await QuestionModel.findById(questionId);
			await question.remove();
		}
		await quiz.remove();
		deleted_quizzes.push(quiz);
	}
	return deleted_quizzes;
}

exports.deleteQuizHandler = deleteQuizHandler;

async function updatePlayedTimesHandler(quizzes, userId) {
	let total_updated = 0;
	if (quizzes) {
		for (let i = 0; i < quizzes.length; i++) {
			const quizId = quizzes[i];
			const quiz = await QuizModel.findById(quizId);
			if (quiz.user.toString() !== userId.toString()) {
				quiz.total_played++;
				total_updated++;
			}
			await quiz.save();
		}
	}
	return total_updated;
}

exports.updatePlayedTimesHandler = updatePlayedTimesHandler;
