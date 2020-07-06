const mongoose = require('mongoose');

const ReportDisabledSchema = new mongoose.Schema({
	type: {
		type: [ String ]
	},
	difficulty: {
		type: [ String ]
	}
});

const ReportQuestionsSchema = new mongoose.Schema({
	question: {
		type: mongoose.Schema.ObjectId,
		ref: 'Question',
		required: true
	},
	user_answers: {
		type: [ String ]
	},
	result: { type: Boolean, required: true },
	time_taken: { type: Number, required: true }
});

const ReportSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		graphql: {
			type: [ false ]
		}
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
		graphql: {
			writable: false
		}
	},
	average_points: { type: Number, scalar: 'NonNegativeInt', required: true },
	average_time: { type: Number, scalar: 'NonNegativeInt', required: true },
	correct: { type: Number, scalar: 'NonNegativeInt', required: true },
	incorrect: { type: Number, scalar: 'NonNegativeInt', required: true },
	total: { type: Number, required: true, scalar: 'PositiveInt' },
	created_at: {
		type: Date,
		default: Date.now(),
		graphql: {
			writable: false
		}
	},
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz',
			required: true
		}
	],
	questions: [ ReportQuestionsSchema ],
	disabled: ReportDisabledSchema
});

ReportSchema.global_configs = {
	global_excludePartitions: [ 'Others', 'Mixed' ]
};

module.exports.ReportSchema = ReportSchema;
module.exports.ReportModel = mongoose.model('Report', ReportSchema);
