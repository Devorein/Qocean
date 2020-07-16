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
		mongql: {
			type: [ false ]
		}
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
		mongql: {
			writable: false
		}
	},
	average_points: {
		type: Number,
		required: true,
		mongql: {
			scalar: 'NonNegativeInt'
		}
	},
	average_time: {
		type: Number,
		required: true,
		mongql: {
			scalar: 'NonNegativeInt'
		}
	},
	correct: {
		type: Number,
		required: true,
		mongql: {
			scalar: 'NonNegativeInt'
		}
	},
	incorrect: {
		type: Number,
		required: true,
		mongql: {
			scalar: 'NonNegativeInt'
		}
	},
	total: {
		type: Number,
		required: true,
		mongql: {
			scalar: 'PositiveInt'
		}
	},
	created_at: {
		type: Date,
		default: Date.now(),
		mongql: {
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

ReportSchema.mongql = {
	generate: {
		query: false,
		mutation: false
	},
	resource: 'report',
	global_excludePartitions: {
		base: [ 'Others', 'Mixed' ]
	}
};

module.exports.ReportSchema = ReportSchema;
module.exports.ReportModel = mongoose.model('Report', ReportSchema);
