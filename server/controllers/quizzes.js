const fs = require('fs');
const path = require('path');

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');
const addRatings = require('../utils/addRatings');

// @desc: Create single quiz
// @route: POST /api/v1/quizzes
// @access: Private
async function createQuizHandler(userId, body, next) {
	body.user = userId;
	const prevQuiz = await Quiz.countDocuments({ name: body.name.trim(), user: userId });
	if (prevQuiz >= 1) return next(new ErrorResponse(`You already have a quiz named ${body.name}`, 400));

	const [ success, message ] = await Quiz.validate(body);
	if (!success) return next(new ErrorResponse(message, 400));
	return await Quiz.create(body);
}

exports.createQuizHandler = createQuizHandler;

exports.createQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await createQuizHandler(req.user._id, req.body, next);
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizzes/:id
// @access: Private

exports.updateQuiz = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const [ quiz ] = await updateResource(Quiz, [ req.body ], req.user._id, next);
	res.status(200).json({ success: true, data: quiz });
});

exports.updateQuizzes = asyncHandler(async (req, res, next) => {
	const quizzes = await updateResource(Quiz, req.body.data, req.user._id, next);
	res.status(200).json({ success: true, data: quizzes });
});

// @desc: Delete single quiz
// @route: DELETE /api/v1/quizzes/:id
// @access: Private

async function deleteQuizHandler(quizIds, userId, next) {
	const deleted_quizzes = [];
	for (let i = 0; i < quizIds.length; i++) {
		const quizId = quizIds[i];
		const quiz = await Quiz.findById(quizId);
		if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
		if (quiz.user.toString() !== userId.toString())
			return next(new ErrorResponse(`User not authorized to delete quiz`, 401));
		if (quiz.image && (!quiz.image.match(/^(http|data:)/) && quiz.image !== 'none.png')) {
			const location = path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${quiz.image}`);
			if (fs.existsSync(location)) fs.unlinkSync(location);
		}
		const { questions } = quiz;
		for (let i = 0; i < questions.length; i++) {
			const questionId = questions[i];
			const question = await Question.findById(questionId);
			await question.remove();
		}
		await quiz.remove();
		deleted_quizzes.push(quiz);
	}
	return deleted_quizzes;
}

exports.deleteQuizHandler = deleteQuizHandler;

exports.deleteQuiz = asyncHandler(async (req, res, next) => {
	const [ quiz ] = await deleteQuizHandler([ req.params.id ], req.user._id, next);
	res.status(200).json({ success: true, data: quiz });
});

exports.deleteQuizzes = asyncHandler(async (req, res, next) => {
	const quizzes = await deleteQuizHandler(req.body.data, req.user._id, next);
	res.status(200).json({ success: true, data: quizzes });
});

// @desc: Upload a single quiz photo
// @route: PUT /api/v1/quizzes/:id/photo
// @access: Private
exports.quizPhotoUpload = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.imageUpload);
});

async function updatePlayedTimesHandler(quizzes, userId) {
	let total_updated = 0;
	if (quizzes) {
		for (let i = 0; i < quizzes.length; i++) {
			const quizId = quizzes[i];
			const quiz = await Quiz.findById(quizId);
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

exports.updatePlayedTimes = asyncHandler(async (req, res, next) => {
	const total_updated = await updatePlayedTimesHandler(req.body, req.user._id);
	res.status(200).json({ success: true, total_updated });
});

exports.updateQuizRatings = asyncHandler(async (req, res, next) => {
	const ratingsData = await addRatings(Quiz, req.body.data, req.user._id, next);
	res.status(200).json({ success: true, ratingsData });
});

exports.playPageQuiz = asyncHandler(async (req, res, next) => {
	const quizzes = await Quiz.find({ user: req.user._id })
		.populate({
			path: 'questions',
			select: 'difficulty time_allocated name type'
		})
		.select('name questions');
	res.status(200).json({ success: true, data: quizzes });
});

exports.watchQuizzes = asyncHandler(async (req, res, next) => {
	const manipulated = await watchAction('quizzes', req.body, req.user);
	res.status(200).json({ success: true, data: manipulated });
});
