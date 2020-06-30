const asyncHandler = require('../middleware/async');
const { FolderModel } = require('../models/Folder');
const Quiz = require('../models/Quiz');

exports.getWatchListCount = asyncHandler(async (req, res, next) => {
	const { type } = req.params;

	const count = await (type === 'quizzes' ? Quiz : FolderModel).countDocuments({ watchers: { $in: [ req.user._id ] } });
	res.status(200).json({ success: true, data: count });
});
