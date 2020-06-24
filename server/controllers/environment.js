const Environment = require('../models/Environment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/updateResource');

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
async function setCurrentEnvironmentHandler(userId, id) {
	const environment = await Environment.findOne({ _id: id, user: userId });
	const user = await User.findById(userId);
	user.current_environment = environment._id;
	await user.save();
	return environment;
}

exports.setCurrentEnvironmentHandler = setCurrentEnvironmentHandler;
exports.setCurrentEnvironment = asyncHandler(async (req, res, next) => {
	const environment = await setCurrentEnvironmentHandler(req.user._id, req.body.id);
	res.status(200).json({ success: true, data: environment });
});

// @desc: Create single environment
// @route: POST /api/v1/environments
// @access: Private

async function createEnvironmentHandler(userId, data, next) {
	data.user = userId;
	let user;
	const prevEnv = await Environment.countDocuments({ name: data.name, user: userId });
	if (prevEnv >= 1) return next(new ErrorResponse(`You already have an environment named ${data.name}`, 400));
	const environment = await Environment.create(data);
	if (data.set_as_current) {
		user = await User.findById(data.user._id);
		user.current_environment = environment._id;
		await user.save();
	}
}

exports.createEnvironmentHandler = createEnvironmentHandler;
exports.createEnvironment = asyncHandler(async (req, res, next) => {
	const environment = await createEnvironmentHandler(req.user._id, req.body, next);
	res.status(201).json({ success: true, data: environment });
});

// @desc: Update single environment
// @route: PUT /api/v1/environments/:id
// @access: Private
exports.updateEnvironment = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const environment = await updateResource(Environment, req.body, req.user._id, next);
	res.status(200).json({ success: true, data: environment });
});

exports.updateEnvironments = asyncHandler(async (req, res, next) => {
	const environments = await updateResource(Environment, req.body.data, req.user._id, next);
	res.status(200).json({ success: true, data: environments });
});

// @desc: Delete single environment
// @route: DELETE /api/v1/environments/:id
// @access: Private

async function deleteEnvironmentHandler(environmentIds, userId, current_environment, next) {
	const deleted_environments = [];
	const totalDocs = await Environment.countDocuments({ user: userId });

	for (let i = 0; i < environmentIds.length; i++) {
		const environmentId = environmentIds[i];
		const environment = await Environment.findById(environmentId).select('name user');
		if (!environment) return next(new ErrorResponse(`Environment not found with id of ${environmentId}`, 404));
		if (environment.user.toString() !== userId.toString())
			return next(new ErrorResponse(`User not authorized to delete environment`, 401));
		if (current_environment.toString() === environment._id.toString())
			return next(new ErrorResponse(`You cannot delete current set environment`, 400));
		else if (i < totalDocs) await environment.remove();
		else return next(new ErrorResponse(`You must have atleast one environment`, 400));
		await environment.remove();
		deleted_environments.push(environment);
	}
	return deleted_environments;
}

exports.deleteEnvironmentHandler = deleteEnvironmentHandler;

exports.deleteEnvironment = asyncHandler(async (req, res, next) => {
	const [ deleted_environment ] = await deleteEnvironmentHandler(
		[ req.params.id ],
		req.user._id,
		req.user.current_environment,
		next
	);
	res.status(200).json({ success: true, data: deleted_environment });
});

exports.deleteEnvironments = asyncHandler(async (req, res, next) => {
	const deleted_environments = await deleteEnvironmentHandler(
		req.body.ids,
		req.user._id,
		req.user.current_environment,
		next
	);
	res.status(200).json({ success: true, data: deleted_environments });
});
