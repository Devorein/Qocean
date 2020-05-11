const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');

const QuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		maxlength: [ 1000, 'Question cant be more than 1000 characters' ],
		minlength: [ 3, 'Question cant be less than 3 characters' ],
		required: [ true, 'Please provide the question' ],
		trim: true
	},
	weight: {
		type: Number,
		default: 1
	},
	quiz: {
		type: mongoose.Schema.ObjectId,
		required: [ true, 'Please provide the quiz id' ]
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
		default: 'Easy'
	},
	favourite: {
		type: Boolean,
		default: false
	},
	image: String
});

const TypeQuestionSchema = extendSchema(QuestionSchema, {
	answers: {
		type: [ [ String ] ],
		required: [ true, 'Please provide answers' ]
	},
	type: {
		type: String,
		enum: [ 'FIB', 'Snippet' ],
		required: [ true, 'Please provide the question type' ]
	},
	timeAllocated: {
		type: Number,
		default: 60
	}
});

const FCQuestionSchema = extendSchema(QuestionSchema, {
	answer: {
		type: String,
		required: [ true, 'Please provide an answer' ]
	},
	type: {
		type: String,
		enum: [ 'FC' ],
		required: [ true, 'Please provide the question type' ]
	},
	addToScore: {
		type: Boolean,
		default: false
	},
	timeAllocated: {
		type: Number,
		default: 45
	}
});

const ClickQuestionSchema = extendSchema(QuestionSchema, {
	answers: {
		type: [ Number ],
		required: [ true, 'Please provide answers' ]
	},
	type: {
		type: String,
		enum: [ 'MCQ', 'MS' ],
		required: [ true, 'Please provide the question type' ]
	},
	option1: {
		type: String,
		required: [ true, 'Please provide first option' ]
	},
	option2: {
		type: String,
		required: [ true, 'Please provide second option' ]
	},
	option3: String,
	option4: String,
	option5: String
});

const TFQuestionSchema = extendSchema(QuestionSchema, {
	answer: {
		type: String,
		required: [ true, 'Please provide answers' ],
		enum: [ 'True', 'False' ]
	},
	type: {
		type: String,
		enum: [ 'TF' ],
		required: [ true, 'Please provide the question type' ]
	}
});

module.exports = mongoose.model('TypeQuestion', TypeQuestionSchema);
module.exports = mongoose.model('FCQuestion', FCQuestionSchema);
module.exports = mongoose.model('ClickQuestion', ClickQuestionSchema);
module.exports = mongoose.model('TFQuestion', TFQuestionSchema);
