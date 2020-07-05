const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	message: String,
	created_at: {
		type: Date,
		default: Date.now(),
		writable: false
	},
	inbox: {
		type: mongoose.Schema.ObjectId,
		ref: 'Inbox'
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		writable: false
	},
	time: { type: Date, default: Date.now },
	read: { type: Boolean, default: false },
	status: String
	// sentUser: {
	// 	type: mongoose.Schema.ObjectId,
	// 	ref: 'User'
	// }
});

MessageSchema.global_configs = {
	global_excludePartitions: [ 'Others', 'Mixed' ]
};

module.exports.MessageSchema = MessageSchema;
module.exports.MessageModel = mongoose.model('Message', MessageSchema);
