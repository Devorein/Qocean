const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
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

exports.WatchlistSchema = WatchlistSchema;
WatchlistSchema.mongql = {
	generate: {
		type: true
	}
};

WatchlistSchema.global_configs = {
	global_excludePartitions: {
		base: [ 'Others', 'Mixed' ]
	},
	global_inputs: {
		base: false
	}
};
module.exports.WatchlistModel = mongoose.model('Watchlist', WatchlistSchema);
