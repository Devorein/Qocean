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

module.exports = mongoose.model('History', HistorySchema);
