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
	ratings: {
		type: Number,
		default: 0
	},
	icon: {
		type: String,
		enum: [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Purple' ],
		default: 'Red'
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
			ref: 'Quiz',
			set: function(quizzes) {
				this._quizzes = this.quizzes;
				return quizzes;
			}
		}
	],
	watchers: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]
});

FolderSchema.methods.manipulateQuiz = async function(shouldAdd, quizId) {
	const quiz = await this.model('Quiz').findById(quizId);
	if (shouldAdd) {
		quiz.folders.push(this._id);
		quiz.total_folders++;
		this.total_questions += quiz.total_questions;
	} else {
		quiz.folders = quiz.folders.filter((_folderId) => _folderId.toString() !== this._id.toString());
		quiz.total_folders--;
		this.total_questions -= quiz.total_questions;
	}
	this.total_quizzes = this.quizzes.length;
	await quiz.save();
};

FolderSchema.pre('save', async function(next) {
	if (this.isModified('user')) await this.model('User').add(this.user, 'quizzes', this._id);
	if (this.isModified('quizzes')) {
		const manip = [];
		if (this._quizzes)
			this._quizzes.forEach((_quiz) => {
				if (!this.quizzes.includes(_quiz))
					manip.push({
						id: _quiz,
						op: 0
					});
			});

		this.quizzes.forEach((quiz) => {
			if (!this._quizzes.includes(quiz))
				manip.push({
					id: quiz,
					op: 1
				});
		});

		for (let i = 0; i < manip.length; i++) {
			const { id, op } = manip[i];
			await this.manipulateQuiz(op, id);
		}
	}
	next();
});

FolderSchema.pre('remove', async function(next) {
	await this.model('User').remove(this.user, 'folders', this._id);
	next();
});

module.exports = mongoose.model('Folder', FolderSchema);
