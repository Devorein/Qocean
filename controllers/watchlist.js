const asyncHandler = require('../middleware/async');
const Folder = require('../models/Folder');
const Quiz = require('../models/Quiz');
const Watchlist = require('../models/Watchlist');

exports.getWatchList = asyncHandler(async (req, res, next) => {
	const { type } = req.params;
	const { watchlist: watchlistId } = req.user;

	const watchlist = await Watchlist.findById(watchlistId).populate(`watched_${type}`);
	res.status(200).json({ success: true, data: watchlist[`watched_${type}`] });
});

exports.getWatchListCount = asyncHandler(async (req, res, next) => {
	const { type } = req.params;

	const count = await (type === 'quizzes' ? Quiz : Folder).countDocuments({ watchers: { $in: [ req.user._id ] } });
	res.status(200).json({ success: true, data: count });
});
