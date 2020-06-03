const mongoose = require('mongoose');

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
	avg_points: { type: Number, required: true },
	avg_timetaken: { type: Number, required: true },
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
	questions: [
		{
			question: {
				type: mongoose.Schema.ObjectId,
				ref: 'Quiz'
			},
			user_answers: [ String ],
			result: { type: String, required: true }
		}
	]
});

module.exports = mongoose.model('Report', ReportSchema);
