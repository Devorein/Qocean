const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');
const { ObjectID } = require('bson');

const FolderSchema = extendSchema(ResourceSchema, {
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
		required: [ true, 'Please provide folder name' ],
		minlength: [ 3, 'Folder name must be greater than 3 characters' ],
		maxlength: [ 20, 'Folder name must be less than 20 characters' ]
	},
	ratings: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	icon: {
		type: String,
		enum: [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Purple' ].map((color) => color + '_folder'),
		default: 'Red'
	},
	total_quizzes: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
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
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz',
			set: function (quizzes) {
				this._quizzes = this.quizzes;
				return quizzes;
			}
		}
	],
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

exports.FolderSchema = FolderSchema;
FolderSchema.mongql = {
	generate: true,
	resource: 'folder',
	Fragments: {
		NameAndId: [ 'name', '_id' ]
	}
};

FolderSchema.methods.manipulateQuiz = async function (shouldAdd, quizId) {
	const quiz = await this.model('Quiz').findById(quizId);
	if (shouldAdd) {
		quiz.folders.push(this._id);
		quiz.total_folders++;
		this.total_questions += quiz.total_questions;
	} else {
		quiz.folders = quiz.folders.filter((_folderId) => _folderId.toString() !== this._id.toString());
		quiz.total_folders--;
		this.total_questions -= quiz.total_questions;
	}
	this.total_quizzes = this.quizzes.length;
	await quiz.save();
};

FolderSchema.statics.precreate = async function (data, SchemaInfo, { User }) {
	const user = await User.findById(data.user);
	user.folders = [ ...user.folders, data._id ];
	user.total_folders++;
	await user.save();
};

FolderSchema.pre('save', async function (next) {
	if (this.isModified('user')) await this.model('User').add(this.user, 'quizzes', this._id);
	if (this.isModified('quizzes')) {
		const manip = [];
		if (this._quizzes)
			this._quizzes.forEach((_quiz) => {
				if (!this.quizzes.includes(_quiz))
					manip.push({
						id: _quiz,
						op: 0
					});
			});

		this.quizzes.forEach((quiz) => {
			if (!this._quizzes.includes(quiz))
				manip.push({
					id: quiz,
					op: 1
				});
		});

		for (let i = 0; i < manip.length; i++) {
			const { id, op } = manip[i];
			await this.manipulateQuiz(op, id);
		}
	}
	next();
});

FolderSchema.pre('remove', async function (next) {
	await this.model('User').remove(this.user, 'folders', this._id);
	next();
});

exports.FolderModel = mongoose.model('Folder', FolderSchema);
