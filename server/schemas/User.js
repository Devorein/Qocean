const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please add a name' ]
	},
	username: {
		type: String,
		required: [ true, 'Please provide an username' ],
		minlength: [ 3, 'User name cant be less than 3 characters long' ],
		maxlength: [ 18, 'User name cant be more than 18 characters long' ],
		unique: true,
		mongql: {
			scalar: 'Username'
		}
	},
	email: {
		type: String,
		required: [ true, 'Please add an email' ],
		unique: true,
		mongql: {
			scalar: 'EmailAddress'
		}
	},
	password: {
		type: String,
		required: [ true, 'Please add a password' ],
		minlength: [ 6, 'Password must be greater than six characters' ],
		select: false,
		mongql: {
			scalar: 'Password',
			attach: false
		}
	},
	resetPasswordToken: {
		type: String,
		mongql: {
			attach: false
		}
	},
	resetPasswordExpire: {
		type: Date,
		mongql: {
			attach: false
		}
	},
	joined_at: {
		type: Date,
		default: Date.now,
		mongql: {
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
	total_environments: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			attach: {
				input: false
			}
		}
	},
	current_environment: {
		type: mongoose.Schema.ObjectId,
		ref: 'Environment',
		required: true,
		mongql: {
			attach: {
				input: false
			}
		}
	},
	version: {
		type: String,
		default: 'Rower',
		enum: [ 'Rower', 'Sailor', 'Captain', 'Admin' ]
	},
	environments: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Environment',
			mongql: {
				attach: {
					input: false
				}
			}
		}
	],
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz',
			mongql: {
				attach: {
					input: false
				}
			}
		}
	],
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
			ref: 'Folder',
			mongql: {
				attach: {
					input: false
				}
			}
		}
	],
	image: { type: String, default: 'none.png' },
	inbox: {
		type: mongoose.Schema.ObjectId,
		ref: 'Inbox',
		mongql: {
			excludePartitions: [ 'Mixed', 'Others' ],
			attach: {
				input: false
			}
		}
	},
	reports: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Report',
			mongql: {
				excludePartitions: [ 'Mixed', 'Others' ],
				attach: {
					input: false
				}
			}
		}
	],
	watchlist: {
		type: mongoose.Schema.ObjectId,
		ref: 'Watchlist',
		mongql: {
			excludePartitions: [ 'Mixed', 'Others' ],
			attach: {
				input: false
			}
		}
	},
	filtersort: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Filtersort',
			mongql: {
				excludePartitions: [ 'Mixed', 'Others' ],
				attach: {
					input: false
				}
			}
		}
	]
});

UserSchema.mongql = {
	generate: {
		mutation: false
	},
	resource: 'user',
	Fragments: {
		Info: [ [ 'current_environment', 'RefsNone' ], 'name', 'username', 'email' ]
	}
};

UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	});
};

UserSchema.methods.matchPassword = async function (enteredPass) {
	return await bcrypt.compare(enteredPass, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

UserSchema.statics.add = async function (userId, field, id) {
	const user = await this.findById(userId);
	user[field].push(id);
	user[`total_${field}`] = user[field].length;
	await user.save();
};

UserSchema.statics.remove = async function (userId, field, id) {
	const user = await this.findById(userId);
	user[field] = user[field].filter((_id) => _id.toString() !== id.toString());
	user[`total_${field}`] = user[field].length;
	await user.save();
};

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('remove', async function (next) {
	const { _id, image } = this;
	await this.model('Quiz').deleteMany({ user: _id });
	await this.model('Question').deleteMany({ user: _id });
	await this.model('Environment').deleteMany({ user: _id });
	await this.model('Folder').deleteMany({ user: _id });
	if (!image.startsWith('http') && image !== 'none.png' && image !== '')
		fs.unlinkSync(path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${image}`));
	next();
});

exports.UserSchema = UserSchema;
exports.UserModel = mongoose.model('User', UserSchema);
