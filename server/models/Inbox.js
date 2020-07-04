const mongoose = require('mongoose');

const InboxSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	messages: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Message'
		}
	]
	// history: [
	// 	{
	// 		type: mongoose.Schema.ObjectId,
	// 		ref: 'History'
	// 	}
	// ]
});

InboxSchema.global_configs = {
	global_partition: {
		base: false
	}
};

module.exports.InboxSchema = InboxSchema;
module.exports.InboxModel = mongoose.model('Inbox', InboxSchema);
