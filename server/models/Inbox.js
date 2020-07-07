const mongoose = require('mongoose');

const InboxSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		graphql: {
			writable: false
		}
	},
	created_at: {
		type: Date,
		default: Date.now(),
		graphql: {
			writable: false
		}
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
	global_excludePartitions: {
		base: [ 'Others', 'Mixed' ]
	}
};

module.exports.InboxSchema = InboxSchema;
module.exports.InboxModel = mongoose.model('Inbox', InboxSchema);
