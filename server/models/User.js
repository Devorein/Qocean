const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
			scalar: 'Password'
		}
	},
	resetPasswordToken: {
		type: String,
		mongql: {
			writable: false
		}
	},
	resetPasswordExpire: {
		type: Date,
		mongql: {
			writable: false
		}
	},
	joined_at: {
		type: Date,
		default: Date.now,
		mongql: {
			writable: false
		}
	},
	total_folders: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	total_questions: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	total_quizzes: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	total_environments: {
		type: Number,
		default: 0,
		mongql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	current_environment: {
		type: mongoose.Schema.ObjectId,
		ref: 'Environment',
		required: true,
		mongql: {
			writable: false
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
				writable: false
			}
		}
	],
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz',
			mongql: {
				writable: false
			}
		}
	],
	questions: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Question',
			mongql: {
				writable: false
			}
		}
	],
	folders: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Folder',
			mongql: {
				writable: false
			}
		}
	],
	image: { type: String, default: 'none.png' },
	inbox: {
		type: mongoose.Schema.ObjectId,
		ref: 'Inbox',
		mongql: {
			excludePartitions: [ 'Mixed', 'Others' ],
			writable: false
		}
	},
	reports: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Report',
			mongql: {
				excludePartitions: [ 'Mixed', 'Others' ],
				writable: false
			}
		}
	],
	watchlist: {
		type: mongoose.Schema.ObjectId,
		ref: 'Watchlist',
		mongql: {
			excludePartitions: [ 'Mixed', 'Others' ],
			writable: false
		}
	},
	filtersort: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Filtersort',
			mongql: {
				excludePartitions: [ 'Mixed', 'Others' ],
				writable: false
			}
		}
	]
});

UserSchema.mongql = {
	generate: {
		type: true,
		query: true
	},
	resource: 'user',
	output: {
		dir: process.cwd()
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
	await this.model('Quiz').deleteMany({ user: this._id });
	await this.model('Question').deleteMany({ user: this._id });
	await this.model('Environment').deleteMany({ user: this._id });
	await this.model('Folder').deleteMany({ user: this._id });
	next();
});

exports.UserSchema = UserSchema;
exports.UserModel = mongoose.model('User', UserSchema);
