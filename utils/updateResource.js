const Quiz = require('../models/Quiz');
const Folder = require('../models/Folder');
const User = require('../models/User');
const Environment = require('../models/Environment');
const Question = require('../models/Question');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ErrorResponse = require('../utils/errorResponse');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

function decideModel(model) {
	switch (model.toLowerCase()) {
		case 'user':
			return User;
		case 'quiz':
			return Quiz;
		case 'question':
			return Question;
		case 'folder':
			return Folder;
		case 'environment':
			return Environment;
		default:
			return User;
	}
}

module.exports = async function(model, id, user, next, body) {
	const Model = decideModel(model);
	const resource = await Model.findById(id);
	if (!resource) return next(new ErrorResponse(`Resource not found with id of ${id}`, 404));
	if (resource.user.toString() !== user._id.toString())
		return next(new ErrorResponse(`User not authorized to update this quiz`, 401));
	body.updated_at = Date.now();
	Object.entries(body).forEach(([ key, value ]) => {
		if (key === 'quizzes' && model === 'folder') resource._quizzes = [ ...resource.quizzes ];
		resource[key] = value;
	});
	return await resource.save();
};
