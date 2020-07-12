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
		graphql: {
			scalar: 'Username'
		}
	},
	email: {
		type: String,
		required: [ true, 'Please add an email' ],
		unique: true,
		graphql: {
			scalar: 'EmailAddress'
		}
	},
	password: {
		type: String,
		required: [ true, 'Please add a password' ],
		minlength: [ 6, 'Password must be greater than six characters' ],
		select: false,
		graphql: {
			scalar: 'Password'
		}
	},
	resetPasswordToken: {
		type: String,
		graphql: {
			writable: false
		}
	},
	resetPasswordExpire: {
		type: Date,
		graphql: {
			writable: false
		}
	},
	joined_at: {
		type: Date,
		default: Date.now,
		graphql: {
			writable: false
		}
	},
	total_folders: {
		type: Number,
		default: 0,
		graphql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	total_questions: {
		type: Number,
		default: 0,
		graphql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	total_quizzes: {
		type: Number,
		default: 0,
		graphql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	total_environments: {
		type: Number,
		default: 0,
		graphql: {
			scalar: 'NonNegativeInt',
			writable: false
		}
	},
	current_environment: {
		type: mongoose.Schema.ObjectId,
		ref: 'Environment',
		required: true,
		graphql: {
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
			graphql: {
				writable: false
			}
		}
	],
	quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz',
			graphql: {
				writable: false
			}
		}
	],
	questions: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Question',
			graphql: {
				writable: false
			}
		}
	],
	folders: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Folder',
			graphql: {
				writable: false
			}
		}
	],
	image: { type: String, default: 'none.png' },
	inbox: {
		type: mongoose.Schema.ObjectId,
		ref: 'Inbox',
		graphql: {
			excludePartitions: [ 'Mixed', 'Others' ],
			writable: false
		}
	},
	reports: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Report',
			graphql: {
				excludePartitions: [ 'Mixed', 'Others' ],
				writable: false
			}
		}
	],
	watchlist: {
		type: mongoose.Schema.ObjectId,
		ref: 'Watchlist',
		graphql: {
			excludePartitions: [ 'Mixed', 'Others' ],
			writable: false
		}
	},
	filtersort: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Filtersort',
			graphql: {
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
	resource: 'user'
};

UserSchema.methods.getSignedJwtToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	});
};

UserSchema.methods.matchPassword = async function(enteredPass) {
	return await bcrypt.compare(enteredPass, this.password);
};

UserSchema.methods.getResetPasswordToken = function() {
	const resetToken = crypto.randomBytes(20).toString('hex');
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

UserSchema.statics.add = async function(userId, field, id) {
	const user = await this.findById(userId);
	user[field].push(id);
	user[`total_${field}`] = user[field].length;
	await user.save();
};

UserSchema.statics.remove = async function(userId, field, id) {
	const user = await this.findById(userId);
	user[field] = user[field].filter((_id) => _id.toString() !== id.toString());
	user[`total_${field}`] = user[field].length;
	await user.save();
};

UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('remove', async function(next) {
	await this.model('Quiz').deleteMany({ user: this._id });
	await this.model('Question').deleteMany({ user: this._id });
	await this.model('Environment').deleteMany({ user: this._id });
	await this.model('Folder').deleteMany({ user: this._id });
	next();
});

exports.UserSchema = UserSchema;
exports.UserModel = mongoose.model('User', UserSchema);
