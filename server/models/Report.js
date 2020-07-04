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
		ref: 'Question'
	},
	user_answers: [ String ],
	result: { type: Boolean, required: true },
	time_taken: Number
});

const ReportSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	average_points: { type: Number, required: true },
	average_time: { type: Number, required: true },
	correct: { type: Number, required: true },
	incorrect: { type: Number, required: true },
	total: { type: Number, required: true },
	created_at: {
		type: Date,
		default: Date.now()
	},
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz'
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
