const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');
const validateColor = require('validate-color');

const QuizSchema = extendSchema(ResourceSchema, {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		mongql: {
			attach: {
				input: {
					create: false
				}
			}
		}
	},
	name: {
		type: String,
		required: [ true, 'Quiz name is required' ],
		trim: true,
		minlength: [ 3, 'Name can not be less than 3 characters' ],
		maxlength: [ 50, 'Name can not be more than 50 characters' ]
	},
	ratings: {
		type: Number,
		max: 10,
		min: 0,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	raters: {
		type: Number,
		default: 0,
		min: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	average_quiz_time: {
		type: Number,
		default: 30,
		mongql: {
			scalar: 'PositiveInt',
			attach: {
				input: false
			}
		}
	},
	average_difficulty: {
		type: String,
		default: 'Beginner',
		enum: [ 'Beginner', 'Intermediate', 'Advanced' ],
		mongql: {
			attach: {
				input: false
			}
		}
	},
	tags: {
		type: [ String ],
		default: []
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
		default: 'none.png',
		mongql: {
			nullable: {
				input: {
					create: [ true ]
				}
			}
		}
	},
	total_questions: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	total_folders: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	questions: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Question',
			mongql: {
				attach: {
					input: false
				}
			}
		}
	],
	folders: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Folder'
		}
	],
	total_played: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	watchers: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			mongql: {
				partitionMapper: {
					Self: 'Others'
				},
				excludePartitions: [ 'Mixed' ],
				attach: {
					input: false
				}
			}
		}
	]
});

QuizSchema.mongql = {
	generate: true,
	resource: 'quiz',
	Fragments: {
		NameAndId: [ 'name', '_id' ]
	}
};

QuizSchema.statics.validate = async function (quiz) {
	let message = '',
		success = true;
	if (quiz.tags.length > 5) return [ false, 'Tags cannot be more than 5' ];
	else {
		const isAllValid = quiz.tags.every((tag) => validateColor.default(tag.toString().split(':')[1]));
		if (!isAllValid) return [ false, 'All tags are not valid' ];
	}
	return [ success, message ];
};

QuizSchema.statics.add = async function (quizId, field, id) {
	const quiz = await this.findById(quizId);
	quiz[field].push(id);
	quiz[`total_${field}`] = quiz[field].length;
	await quiz.save();
};

QuizSchema.statics.remove = async function (quizId, field, id) {
	const quiz = await this.findById(quizId);
	quiz[field] = quiz[field].filter((_id) => _id.toString() !== id.toString());
	quiz[`total_${field}`] = quiz[field].length;
	await quiz.save();
};

QuizSchema.statics.precreate = async function (data, SchemaInfo, { User }) {
	const user = await User.findById(data.user);
	user.quizzes = [ ...user.quizzes, data._id ];
	user.total_quizzes++;
	await user.save();
};

QuizSchema.pre('save', async function (next) {
	if (this.isModified('user')) await this.model('User').add(this.user, 'quizzes', this._id);
	next();
});

QuizSchema.pre('remove', async function (next) {
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

exports.QuizSchema = QuizSchema;
exports.QuizModel = mongoose.model('Quiz', QuizSchema);
