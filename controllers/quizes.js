const path = require('path');
const Quiz = require('../models/Quiz');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all quizes
// @route: GET /api/v1/quizes
exports.getQuizes = asyncHandler(async (req, res, next) => {
	let query;

	const reqQuery = { ...req.query };

	// Fields to exclude
	const excludeFields = [ 'select', 'sort', 'page', 'limit' ];
	excludeFields.forEach((param) => delete reqQuery[param]);

	let queryStr = JSON.stringify(reqQuery);

	// Create mongodb operators
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
	query = Quiz.find(JSON.parse(queryStr)).populate('questions');

	// Getting the selected fields using projection
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else query = query.sort('-createdAt');

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Quiz.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Pagination result
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

	const quizes = await query;
	res.status(200).json({ success: true, count: quizes.length, pagination, data: quizes });
});

// @desc: Get single quiz
// @route: GET /api/v1/quizes/:id
exports.getQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Create single quiz
// @route: POST /api/v1/quizes/:id
exports.createQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.create(req.body);
	res.status(201).json({ success: true, data: quiz });
});

// @desc: Update single quiz
// @route: PUT /api/v1/quizes/:id
exports.updateQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Delete single quiz
// @route: DELETE /api/v1/quizes/:id
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	await quiz.remove();
	res.status(200).json({ success: true, data: quiz });
});

// @desc: Upload a single quiz photo
// @route: PUT /api/v1/quizes/:id/photo
// @access: Private
exports.quizPhotoUpload = asyncHandler(async (req, res, next) => {
	const quiz = await Quiz.findById(req.params.id);
	if (!quiz) return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404));
	if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));
	const { file } = req.files;

	if (!file.mimetype.startsWith('image/')) return next(new ErrorResponse(`Please upload an image file`, 400));

	if (file.size > process.env.FILE_UPLOAD_SIZE)
		return next(new ErrorResponse(`Photo larger than ${process.env.FILE_UPLOAD_SIZE / 1000000}mb`, 400));

	file.name = `quiz_${quiz._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) return next(new ErrorResponse(`Problem with file upload`, 500));
		await Quiz.findByIdAndUpdate(quiz._id, {
			image: file.name
		});
		res.status(200).json({ success: true, data: file.name });
	});
});
