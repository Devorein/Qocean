const mongoose = require('mongoose');
const slugify = require('slugify');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const QuizSchema = extendSchema(
	ResourceSchema,
	{
		name: {
			type: String,
			required: [ true, 'Please add a name' ],
			unique: true,
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
		averageTimeAllocated: {
			type: Number,
			default: 30
		},
		averageDifficulty: {
			type: String,
			default: 'Beginner',
			enum: [ 'Beginner', 'Intermediate', 'Advanced' ]
		},
		slug: String,
		createdAt: {
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
			type: {
				required: true,
				type: String,
				enum: [ 'Web', 'Local' ]
			},
			link: {
				default: '',
				type: String
			}
		},
		image: {
			type: String,
			default: null
		},
		questionCount: {
			type: Number,
			default: 0
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

QuizSchema.virtual('questions', {
	ref: 'Question',
	localField: '_id',
	foreignField: 'quiz',
	justOne: false
});

QuizSchema.pre('save', async function(next) {
	await this.model('User').add(this.user, 'quizzes', this._id);
	this.slug = slugify(this.name, { lower: true });
	next();
});

QuizSchema.pre('remove', async function(next) {
	await this.model('User').remove(this.user, 'quizzes', this._id);
	await this.model('Question').deleteMany({ quiz: this._id });
	next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
