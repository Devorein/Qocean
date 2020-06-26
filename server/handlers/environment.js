const Environment = require('../models/Environment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.setCurrentEnvironmentHandler = async function setCurrentEnvironmentHandler(userId, id) {
	const environment = await Environment.findOne({ _id: id, user: userId });
	const user = await User.findById(userId);
	user.current_environment = environment._id;
	await user.save();
	return environment;
};

exports.createEnvironmentHandler = async function createEnvironmentHandler(userId, data, next) {
	data.user = userId;
	let user;
	const prevEnv = await Environment.countDocuments({ name: data.name, user: userId });
	if (prevEnv >= 1) return next(new ErrorResponse(`You already have an environment named ${data.name}`, 400));
	const environment = await Environment.create(data);
	if (data.set_as_current) {
		user = await User.findById(userId);
		user.current_environment = environment._id;
		await user.save();
	}
};

exports.deleteEnvironmentHandler = async function deleteEnvironmentHandler(
	environmentIds,
	userId,
	current_environment,
	next
) {
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
};
