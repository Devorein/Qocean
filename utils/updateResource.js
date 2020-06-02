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

function decideType(type) {
	switch (type.toLowerCase()) {
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

module.exports = async function(type, id, user, next, body) {
	const Type = decideType(type);
	const resource = await Type.findById(id);
	console.log(resource);
	if (!resource) return next(new ErrorResponse(`Quiz not found with id of ${id}`, 404));
	if (resource.user.toString() !== user._id.toString())
		return next(new ErrorResponse(`User not authorized to update this quiz`, 401));
	body.updated_at = Date.now();
	const updatedResource = await Type.findByIdAndUpdate(id, body, { new: true, runValidators: true });
	return updatedResource;
};
