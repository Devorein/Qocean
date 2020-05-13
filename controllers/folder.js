const Folder = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Get all folders
// @route: GET /api/v1/folders
// @access: Public
exports.getFolders = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});
