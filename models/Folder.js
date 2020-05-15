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
	quizzesCount: {
		type: Number,
		default: 0
	},
	questionsCount: {
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

FolderSchema.methods.quiz = async function(op, quizId) {
	const quiz = await this.model('Quiz').findById(quizId);
	if (op === 1) {
		this.quizzes.push(quizId);
		quiz.folders.push(this._id);
		this.quizzesCount++;
		this.questionsCount += quiz.questionsCount;
	} else if (op === 0) {
		this.quizzes = this.quizzes.filter((_quizId) => quizId.toString() !== _quizId.toString());
		quiz.folders = quiz.folders.filter((_folderId) => _folderId.toString() !== this._id.toString());
		this.quizzesCount--;
		this.questionsCount -= quiz.questionsCount;
	}
	await quiz.save();
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
