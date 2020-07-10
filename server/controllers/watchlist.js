const asyncHandler = require('../middleware/async');
const { FolderModel } = require('../models/Folder');
const { QuizModel } = require('../models/Quiz');

exports.getWatchListCount = asyncHandler(async (req, res) => {
	const { type } = req.params;

	const count = await (type === 'quizzes' ? QuizModel : FolderModel).countDocuments({
		watchers: { $in: [ req.user._id ] }
	});
	res.status(200).json({ success: true, data: count });
});
