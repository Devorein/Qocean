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
	],
	history: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'History'
		}
	]
});

module.exports = mongoose.model('Inbox', InboxSchema);
