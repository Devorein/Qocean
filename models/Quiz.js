const mongoose = require('mongoose');
const slugify = require('slugify');

const QuizSchema = new mongoose.Schema(
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
		rating: {
			type: Number,
			max: 10,
			min: 1,
			default: 5
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

QuizSchema.pre('remove', async function(next) {
	await this.model('Question').deleteMany({ quiz: this._id });
	next();
});

QuizSchema.pre('save', function(next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
