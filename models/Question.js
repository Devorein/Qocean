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
		ref: 'Quiz',
		required: [ true, 'Please provide the quiz id' ]
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [ true, 'A question must be created by an user' ]
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
	public: {
		type: Boolean,
		default: true
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

QuestionSchema.statics.getAverageTimeAllocated = async function(quizId) {
	const obj = await this.aggregate([
		{
			$match: { quiz: quizId }
		},
		{
			$group: {
				_id: '$quiz',
				averageTimeAllocated: { $avg: '$timeAllocated' }
			}
		}
	]);
	try {
		await this.model('Quiz').findByIdAndUpdate(quizId, {
			averageTimeAllocated: obj[0].averageTimeAllocated
		});
	} catch (err) {
		console.log(err);
	}
};

QuestionSchema.statics.getAverageDifficulty = async function(quizId) {
	const obj = await this.aggregate([
		{
			$match: { quiz: quizId }
		},
		{
			$project: {
				difficulty: {
					$cond: {
						if: { $eq: [ '$difficulty', 'Beginner' ] },
						then: 3.33,
						else: {
							$cond: { if: { $eq: [ '$difficulty', 'Intermediate' ] }, then: 6.66, else: 10 }
						}
					}
				}
			}
		},
		{
			$group: {
				_id: '$quiz',
				averageDifficulty: { $avg: '$difficulty' }
			}
		}
	]);
	try {
		const parsed = parseFloat(obj[0].averageDifficulty);
		await this.model('Quiz').findByIdAndUpdate(quizId, {
			averageDifficulty: parsed <= 3.34 ? 'Beginner' : parsed <= 6.67 ? 'Intermediate' : 'Advanced'
		});
	} catch (err) {
		console.log(err);
	}
};

QuestionSchema.post('save', async function() {
	await this.model('User').add(this.user, 'questions', this._id);
	this.constructor.getAverageTimeAllocated(this.quiz);
	this.constructor.getAverageDifficulty(this.quiz);
});

QuestionSchema.pre('remove', async function() {
	await this.model('User').remove(this.user, 'questions', this._id);
	this.constructor.getAverageTimeAllocated(this.quiz);
	this.constructor.getAverageDifficulty(this.quiz);
});

module.exports = mongoose.model('Question', QuestionSchema);
