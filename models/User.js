const mongoose = require('mongoose');

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
		minlength: 6,
		select: false
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	},
	settings: mongoose.Schema.ObjectId
});

module.exports = mongoose.model('User', UserSchema);
