const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	message: String,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	time: { type: Date, default: Date.now },
	read: { type: Boolean, default: false },
	status: String,
	sentUser: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Message', MessageSchema);
