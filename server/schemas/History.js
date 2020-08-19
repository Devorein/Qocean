const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
	message: String,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		graphql: {
			writable: false
		}
	},
	time: { type: Date, default: Date.now }
});

HistorySchema.mongql = {
	skip: true,
	resource: 'history'
};

module.exports = HistorySchema;
