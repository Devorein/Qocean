const Quiz = require('../models/Quiz');
const Folder = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const path = require('path');

// @desc: Create single quiz
// @route: POST /api/v1/quizzes
// @access: Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const prevQuiz = await Quiz.countDocuments({ name: req.body.name.trim(), user: req.user._id });
	if (prevQuiz >= 1) return next(new ErrorResponse(`You already have a quiz named ${req.body.name}`, 400));
	const targetquizzes = req.body.quizzes;
	delete req.body.quizzes;
	const [ success, message ] = await Quiz.validate(req.body);
	if (!success) return next(new ErrorResponse(message, 400));

	const quiz = await Quiz.create(req.body);
	if (targetquizzes) {
		const quizzesPromise = [];
		for (let i = 0; i < targetquizzes.length; i++) {
			const quizId = targetquizzes[i];
			quizzesPromise.push(Quiz.findById(quizId));
		}
		try {
			const quizzes = await Promise.all(quizzesPromise);
			for (let i = 0; i < quizzes.length; i++) {
				const quiz = quizzes[i];
				await quiz.quiz(1, quiz._id);
				await quiz.save();
			}
		} catch (err) {
			return next(new ErrorResponse(err), 404);
		}
	}
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizzes/:id
// @access: Private
exports.updateQuiz = asyncHandler(async (req, res, next) => {
	let quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	if (quiz.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to update this quiz`, 401));
	req.body.updated_at = Date.now();
	quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Delete single quiz
// @route: DELETE /api/v1/quizzes/:id
// @access: Private
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	if (quiz.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete quiz`, 401));
	if (quiz.image && (!quiz.image.match(/^(http|data:)/) && quiz.image !== 'none.png')) {
		const location = path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${quiz.image}`);
		if (fs.existsSync(location)) fs.unlinkSync(location);
	}
	await quiz.remove();
	res.status(200).json({ success: true, data: quiz });
});

exports.deleteQuizzes = asyncHandler(async (req, res, next) => {
	const { quizzes } = req.body;
	for (let i = 0; i < quizzes.length; i++) {
		const quizId = quizzes[i];
		const quiz = await Quiz.findById(quizId);
		if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
		if (quiz.user.toString() !== req.user._id.toString())
			return next(new ErrorResponse(`User not authorized to delete quiz`, 401));
		if (quiz.image && (!quiz.image.match(/^(http|data:)/) && quiz.image !== 'none.png')) {
			const location = path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${quiz.image}`);
			if (fs.existsSync(location)) fs.unlinkSync(location);
		}
		await quiz.remove();
	}
	res.status(200).json({ success: true, data: quizzes.length });
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
	console.log(ratings);

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
