const { EnvironmentModel } = require('../models/Environment');

const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/resource/updateResource');

const {
	createEnvironmentHandler,
	deleteEnvironmentHandler,
	setCurrentEnvironmentHandler
} = require('../handlers/environment');

// @desc: Get current environment
// @route: GET /api/v1/environments/current
// @access: Private
exports.getCurrentEnvironment = asyncHandler(async (req, res) => {
	const environment = await EnvironmentModel.findById(
		req.user.current_environment
	);
	res.status(200).json({ success: true, data: environment });
});

// @desc: Create single environment
// @route: POST /api/v1/environments/setcurrent
// @access: Private

exports.setCurrentEnvironment = asyncHandler(async (req, res) => {
	const environment = await setCurrentEnvironmentHandler(
		req.user._id,
		req.body.id
	);
	res.status(200).json({ success: true, data: environment });
});

// @desc: Create single environment
// @route: POST /api/v1/environments
// @access: Private

exports.createEnvironment = asyncHandler(async (req, res, next) => {
	const environment = await createEnvironmentHandler(
		req.user._id,
		req.body,
		next
	);
	res.status(201).json({ success: true, data: environment });
});

// @desc: Update single environment
// @route: PUT /api/v1/environments/:id
// @access: Private
exports.updateEnvironment = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const environment = await updateResource(
		EnvironmentModel,
		req.body,
		req.user._id,
		next
	);
	res.status(200).json({ success: true, data: environment });
});

exports.updateEnvironments = asyncHandler(async (req, res, next) => {
	const environments = await updateResource(
		EnvironmentModel,
		req.body.data,
		req.user._id,
		next
	);
	res.status(200).json({ success: true, data: environments });
});

// @desc: Delete single environment
// @route: DELETE /api/v1/environments/:id
// @access: Private

exports.deleteEnvironment = asyncHandler(async (req, res, next) => {
	const [deleted_environment] = await deleteEnvironmentHandler(
		[req.params.id],
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
