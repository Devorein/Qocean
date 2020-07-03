const { EnvironmentModel } = require('../models/Environment');
const { InboxModel } = require('../models/Inbox');
const { WatchlistModel } = require('../models/Watchlist');
const { ObjectID } = require('bson');
const ErrorResponse = require('../utils/errorResponse');
const { UserModel } = require('../models/User');
const sendTokenResponse = require('../utils/sendTokenResponse');

async function registerHandler(body) {
	const { name, email, password, version, username, image } = body;
	const env_id = new ObjectID();
	const inbox_id = new ObjectID();
	const watchlist_id = new ObjectID();
	const data = {
		name,
		email,
		password,
		version,
		username,
		current_environment: env_id.toString(),
		inbox: inbox_id.toString(),
		watchlist: watchlist_id.toString()
	};
	if (image) data.image = image;
	const user = await UserModel.create(data);
	await EnvironmentModel.create({ user: user._id, _id: env_id, name: 'Default Environment' });
	await InboxModel.create({ user: user._id, _id: inbox_id });
	await WatchlistModel.create({ user: user._id, _id: watchlist_id });
	return sendTokenResponse(user);
}

exports.registerHandler = registerHandler;

async function loginHandler(body, next) {
	const { email, password } = body;

	if (!email || !password) return next(new ErrorResponse(`Please provide an email and password`, 400));
	const user = await UserModel.findOne({ email }).select('+password');
	if (!user) return next(new ErrorResponse(`Invalid credentials`, 401));
	const isMatch = await user.matchPassword(password);
	if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 401));
	return sendTokenResponse(user);
}

exports.loginHandler = loginHandler;

async function checkPasswordHandler(userId, password, next) {
	const user = await UserModel.findById(userId).select('+password');
	const isMatch = await user.matchPassword(password);
	if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 400));
	else return true;
}

exports.checkPasswordHandler = checkPasswordHandler;
