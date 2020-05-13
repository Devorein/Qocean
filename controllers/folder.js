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
	const folder = await Folder.findById(req.params.id).select('-favourite -public');
	if (!folder) return next(new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404));
	res.status(200).json({ success: true, data: folder });
});
