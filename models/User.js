const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Folder = require('./Folder');

const { isAlphaNumericOnly, isStrongPassword } = require('../utils/validation');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please add a name' ]
	},
	email: {
		type: String,
		required: [ true, 'Please add an email' ],
		unique: true,
		match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
	},
	password: {
		type: String,
		required: [ true, 'Please add a password' ],
		minlength: [ 6, 'Password must be greater than six characters' ],
		select: false,
		validate: {
			validator(v) {
				return isStrongPassword(v);
			},
			message: () => `Password is not strong enough`
		}
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	},
	settings: {
		type: mongoose.Schema.ObjectId,
		ref: 'Settings'
	},
	folderCount: {
		type: Number,
		default: 0
	},
	questionCount: {
		type: Number,
		default: 0
	},
	quizCount: {
		type: Number,
		default: 0
	},
	version: {
		type: String,
		default: 'Rower',
		enum: [ 'Rower', 'Sailor', 'Captain', 'Admin' ]
	},
	quizes: [ { type: mongoose.Schema.ObjectId, ref: 'Quiz' } ],
	questions: [ { type: mongoose.Schema.ObjectId, ref: 'Question' } ],
	folders: [ { type: mongoose.Schema.ObjectId, ref: 'Folder' } ],
	username: {
		type: String,
		required: [ true, 'Please provide an username' ],
		minlength: [ 3, 'User name cant be less than 3 characters long' ],
		maxlength: [ 10, 'User name cant be more than 10 characters long' ],
		unique: true,
		validate: {
			validator(v) {
				return isAlphaNumericOnly(v);
			},
			message: () => `Invalid username`
		}
	}
});

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
	await user.save();
};

UserSchema.statics.remove = async function(userId, field, id) {
	const user = await this.findById(userId);
	user[field] = user[field].filter((_id) => _id.toString() !== id.toString());
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
	await this.model('Settings').deleteMany({ user: this._id });
	await Folder.deleteMany({ user: this._id });
	next();
});

module.exports = mongoose.model('User', UserSchema);
