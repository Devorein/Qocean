const { flatten } = require('lodash');
const fs = require('fs');
const path = require('path');

const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');

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

exports.getAllTags = asyncHandler(async (req, res, next) => {
	let tags = await Quiz.find(
		{
			$nor: [ { tags: { $exists: false } }, { tags: { $size: 0 } } ]
		},
		{ tags: 1, _id: 0 }
	);
	tags = Array.from(new Set(flatten(tags.map(({ tags }) => tags)).map((tag) => tag.split(':')[0])));
	res.status(200).json({ success: true, data: tags });
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

exports.updatePlayedTimes = asyncHandler(async (req, res, next) => {
	const { quizzes } = req.body;
	if (quizzes) {
		for (let i = 0; i < quizzes.length; i++) {
			const quizId = quizzes[i];
			const quiz = await Quiz.findById(quizId);
			if (quiz.user.toString() !== req.user._id.toString()) quiz.total_played = quiz.total_played + 1;
			await quiz.save();
		}
	}
	res.status(200).json({ success: true, total_updated: quizzes.length });
});

exports.updateQuizRatings = asyncHandler(async (req, res, next) => {
	let { quizzes, ratings } = req.body;
	ratings = ratings.map((rating) => parseFloat(rating));
	const safe_ratings = ratings.every((rating) => rating >= 0 && rating <= 10);
	if (!safe_ratings) return next(new ErrorResponse(`You cannot have a rating more than 10 or less than 0`, 400));
	const ratingsData = [];
	if (ratings.length !== quizzes.length) {
		const lastRatings = ratings[ratings.length - 1];
		for (let i = 0; i < quizzes.length - ratings.length; i++) ratings.push(lastRatings);
	}

	if (quizzes) {
		for (let i = 0; i < quizzes.length; i++) {
			const quizId = quizzes[i];
			const quiz = await Quiz.findById(quizId).select('user ratings raters');
			const prevRatings = parseFloat(quiz.ratings);
			let newRatings = prevRatings;
			let raters = parseInt(quiz.raters);
			if (quiz.user.toString() !== req.user._id.toString()) {
				raters++;
				quiz.raters = raters;
				newRatings = parseFloat(((prevRatings + ratings[i]) / (raters !== 1 ? 2 : 1)).toFixed(2));
				quiz.ratings = newRatings;
				await quiz.save();
			}

			ratingsData.push({
				_id: quiz._id,
				prevRatings,
				newRatings,
				raters
			});
		}
	}
	res.status(200).json({ success: true, total_rated: ratingsData });
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
