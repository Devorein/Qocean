const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		maxlength: [ 1000, 'Question cant be more than 1000 characters' ],
		minlength: [ 3, 'Question cant be less than 3 characters' ],
		required: [ true, 'Please provide the question' ],
		trim: true
	},
	type: {
		type: String,
		enum: [ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ],
		required: [ true, 'Please provide the question type' ]
	},
	weight: {
		type: Number,
		default: 1
	},
	quiz: {
		type: mongoose.Schema.ObjectId,
		required: [ true, 'Please provide the quiz id' ],
		ref: 'Quiz'
	},
	addToScore: {
		type: Boolean,
		default: true
	},
	timeAllocated: {
		type: Number,
		default: 30,
		min: 15,
		max: 120
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	difficulty: {
		type: String,
		enum: [ 'Beginner', 'Intermediate', 'Advanced' ],
		default: 'Beginner'
	},
	favourite: {
		type: Boolean,
		default: false
	},
	image: {
		type: String,
		default: null
	},
	answers: {
		type: [ [ String ] ],
		required: [ true, 'Please provide answers' ]
	},
	options: {
		type: [ String ],
		required: true
	}
});

module.exports = mongoose.model('Question', QuestionSchema);
