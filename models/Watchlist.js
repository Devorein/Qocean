const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	watched_folders: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Folder'
		}
	],
	watched_quizzes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Quiz'
		}
	]
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
