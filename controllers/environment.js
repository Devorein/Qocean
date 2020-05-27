const Environment = require('../models/Environment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get current environment
// @route: GET /api/v1/environments/current
// @access: Private
exports.getCurrentEnvironment = asyncHandler(async (req, res, next) => {
	const environment = await Environment.findById(req.user.current_environment);
	res.status(200).json({ success: true, data: environment });
});

// @desc: Create single environment
// @route: POST /api/v1/environments/setcurrent
// @access: Private
exports.setCurrentEnvironment = asyncHandler(async (req, res, next) => {
	const environment = await Environment.findOne({ _id: req.body.env, user: req.user._id });
	const user = await User.findById(req.user._id);
	user.current_environment = environment._id;
	await user.save();
	res.status(200).json({ success: true, data: environment });
});

// @desc: Create single environment
// @route: POST /api/v1/environments
// @access: Private
exports.createEnvironment = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	let user;
	const prevEnv = await Environment.countDocuments({ name: req.body.name, user: req.user._id });
	if (prevEnv >= 1) return next(new ErrorResponse(`You already have an environment named ${req.body.name}`, 400));
	const environment = await Environment.create(req.body);
	if (req.body.set_as_current) {
		user = await User.findById(req.body.user._id);
		user.current_environment = environment._id;
		await user.save();
	}
	res.status(201).json({ success: true, data: environment });
});

// @desc: Update single environment
// @route: PUT /api/v1/environments/:id
// @access: Private
exports.updateEnvironment = asyncHandler(async (req, res, next) => {
	let environment = await Environment.findById(req.params.id);
	if (!environment) return next(new ErrorResponse(`Environment not found with id of ${req.params.id}`, 404));
	if (environment.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to update this environment`, 401));
	environment = await Environment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	res.status(200).json({ success: true, data: environment });
});

// @desc: Delete single environment
// @route: DELETE /api/v1/environments/:id
// @access: Private
exports.deleteEnvironment = asyncHandler(async (req, res, next) => {
	const environment = await Environment.findById(req.params.id).select('name user');
	if (!environment) return next(new ErrorResponse(`Environment not found with id of ${req.params.id}`, 404));
	if (environment.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete environment`, 401));
	const totalDocs = await Environment.countDocuments({ user: req.user._id });
	if (totalDocs > 1) {
		await environment.remove();
		res.status(200).json({ success: true, data: environment });
	} else return next(new ErrorResponse(`You must have atleast one environment`, 400));
});
