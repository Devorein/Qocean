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
		enum: [
			'Red_folder.svg',
			'Orange_folder.svg',
			'Yellow_folder.svg',
			'Green_folder.svg',
			'Blue_folder.svg',
			'Indigo_folder.svg',
			'Purple_folder.svg'
		],
		default: 'Red_folder.svg'
	},
	total_quizzes: {
		type: Number,
		default: 0
	},
	total_questions: {
		type: Number,
		default: 0
	},
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz'
		}
	],
	watchers: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]
});

FolderSchema.methods.quiz = async function(op, quizId) {
	function quizRelation(self, quiz, quizId) {
		if (op === 1) {
			self.quizzes.push(quizId);
			quiz.folders.push(self._id);
			quiz.total_folders++;
			self.total_quizzes++;
			self.total_questions += quiz.total_questions;
		} else if (op === 0) {
			self.quizzes = self.quizzes.filter((_quizId) => quizId.toString() !== _quizId.toString());
			quiz.folders = quiz.folders.filter((_folderId) => _folderId.toString() !== self._id.toString());
			quiz.total_folders--;
			self.total_quizzes--;
			self.total_questions -= quiz.total_questions;
		}
	}
	if (Array.isArray(quizId)) {
		for (let i = 0; i < quizId.length; i++) {
			const quiz = await this.model('Quiz').findById(quizId[i]);
			quizRelation(this, quiz, quizId[i]);
			await quiz.save();
		}
	} else {
		const quiz = await this.model('Quiz').findById(quizId);
		quizRelation(this, quiz, quizId);
		await quiz.save();
	}
};

FolderSchema.pre('save', async function(next) {
	if (this.isModified('user')) await this.model('User').add(this.user, 'quizzes', this._id);
	next();
});

FolderSchema.pre('remove', async function(next) {
	await this.model('User').remove(this.user, 'folders', this._id);
	next();
});

module.exports = mongoose.model('Folder', FolderSchema);
