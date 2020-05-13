const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
	icon: {
		type: String,
		default: 'default.svg'
	},
	quizCount: {
		type: Number,
		default: 0
	},
	user: {
		type: mongoose.Schema.ObjectId,
		required: [ true, 'Please provide an user' ]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	quizes: [ mongoose.Schema.ObjectId ]
});

module.exports = mongoose.model('Folder', FolderSchema);
