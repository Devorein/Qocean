const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const FolderSchema = extendSchema(ResourceSchema, {
	name: {
		type: String,
		required: [ true, 'Please provide folder name' ],
		minlength: [ 3, 'Folder name must be greater than 3 characters' ],
		maxlength: [ 20, 'Folder name must be less than 20 characters' ]
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
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz'
		}
	]
});

FolderSchema.pre('save', async function(next) {
	await this.model('User').add(this.user, 'folders', this._id);
	next();
});

FolderSchema.pre('remove', async function(next) {
	await this.model('User').remove(this.user, 'folders', this._id);
	next();
});

module.exports = mongoose.model('Folder', FolderSchema);
