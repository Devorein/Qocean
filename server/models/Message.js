const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	message: String,
	inbox: {
		type: mongoose.Schema.ObjectId,
		ref: 'Inbox'
	},
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

module.exports.MessageSchema = MessageSchema;
module.exports.MessageModel = mongoose.model('Message', MessageSchema);
