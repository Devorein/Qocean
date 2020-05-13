const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please provide folder name' ],
		minlength: [ 3, 'Folder name must be greater than 3 characters' ],
		maxlength: [ 20, 'Folder name must be less than 20 characters' ]
	},
	favourite: {
		type: Boolean,
		default: false
	},
	icon: {
		type: String,
		default: 'default.svg'
	},
	quizCount: {
		type: Number,
		default: 0
	},
	questionCount: {
		type: Number,
		default: 0
	},
	user: {
		type: mongoose.Schema.ObjectId,
		required: [ true, 'Please provide an user' ]
	},
	public: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	quizes: [ mongoose.Schema.ObjectId ]
});

module.exports = mongoose.model('Folder', FolderSchema);
