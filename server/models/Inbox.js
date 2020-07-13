const mongoose = require('mongoose');

const InboxSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		mongql: {
			writable: false
		}
	},
	created_at: {
		type: Date,
		default: Date.now(),
		mongql: {
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

InboxSchema.mongql = {
	generate: {
		type: true
	},
	resource: 'inbox',
	global_excludePartitions: {
		base: [ 'Others', 'Mixed' ]
	}
};

module.exports.InboxSchema = InboxSchema;
module.exports.InboxModel = mongoose.model('Inbox', InboxSchema);
