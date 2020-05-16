const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const QuizSchema = extendSchema(
	ResourceSchema,
	{
		name: {
			type: String,
			required: [ true, 'Please add a name' ],
			trim: true,
			minlength: [ 3, 'Name can not be less than 3 characters' ],
			maxlength: [ 50, 'Name can not be more than 50 characters' ]
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [ true, 'A question must be created by an user' ]
		},
		public: {
			type: Boolean,
			default: true
		},
		rating: {
			type: Number,
			max: 10,
			min: 1,
			default: 1
		},
		average_quiz_time: {
			type: Number,
			default: 30
		},
		average_difficulty: {
			type: String,
			default: 'Beginner',
			enum: [ 'Beginner', 'Intermediate', 'Advanced' ]
		},
		created_at: {
			type: Date,
			default: Date.now
		},
		tags: [ String ],
		favourite: {
			type: Boolean,
			default: false
		},
		subject: {
			type: String,
			required: [ true, 'Please provide a subject' ]
		},
		source: {
			type: String,
			default: ''
		},
		image: {
			type: String,
			default: null
		},
		total_questions: {
			type: Number,
			default: 0
		},
		total_folders: {
			type: Number,
			default: 0
		},
		questions: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Question'
			}
		],
		folders: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Folder'
			}
		]
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

QuizSchema.statics.add = async function(quizId, field, id) {
	const quiz = await this.findById(quizId);
	quiz[field].push(id);
	quiz[`total_${field}`] = quiz[field].length;
	await quiz.save();
};

QuizSchema.statics.remove = async function(quizId, field, id) {
	const quiz = await this.findById(quizId);
	quiz[field] = quiz[field].filter((_id) => _id.toString() !== id.toString());
	quiz[`total_${field}`] = quiz[field].length;
	await quiz.save();
};

QuizSchema.pre('save', async function(next) {
	if (this.isModified('user')) await this.model('User').add(this.user, 'quizzes', this._id);
	next();
});

QuizSchema.pre('remove', async function(next) {
	await this.model('User').remove(this.user, 'quizzes', this._id);
	const questions = await this.model('Question').find({ quiz: this._id });
	for (let i = 0; i < questions.length; i++) await questions[i].remove();
	const folders = await this.model('Folder').find({ quizzes: this._id });
	for (let i = 0; i < folders.length; i++) {
		const folder = folders[i];
		folder.quizzes = folder.quizzes.filter((quizId) => quizId.toString() !== this._id.toString());
		folder.total_quizzes--;
		await folder.save();
	}
	next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
