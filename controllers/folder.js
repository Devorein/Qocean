const Folder = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all folders
// @route: GET /api/v1/folders
// @access: Public
exports.getFolders = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc: Get single folder by id
// @route: GET /api/v1/folders/:id
// @access: Public
exports.getFolderById = asyncHandler(async (req, res, next) => {
	const folder = await Folder.findOne({ _id: req.params.id, public: true }).select('-favourite -public').populate({
		path: 'quizes',
		select: 'name'
	});
	if (!folder) return next(new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: folder });
});

// @desc: Get folders of current user
// @route: GET /api/v1/users/me/folders
// @access: Private
exports.getCurrentUserFolders = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});
