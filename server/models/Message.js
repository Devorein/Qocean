const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	message: String,
	created_at: {
		type: Date,
		default: Date.now(),
		mongql: {
			writable: false
		}
	},
	inbox: {
		type: mongoose.Schema.ObjectId,
		ref: 'Inbox',
		mongql: {
			writable: false
		}
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		mongql: {
			writable: false
		}
	},
	time: { type: Date, default: Date.now },
	read: { type: Boolean, default: false },
	status: String
	// sentUser: {
	// 	type: mongoose.Schema.ObjectId,
	// 	ref: 'User'
	// }
});

MessageSchema.mongql = {
	generate: {
		type: true
	},
	resource: 'message',
	global_configs: {
		global_excludePartitions: {
			base: [ 'Others', 'Mixed' ]
		}
	}
};

module.exports.MessageSchema = MessageSchema;
module.exports.MessageModel = mongoose.model('Message', MessageSchema);
