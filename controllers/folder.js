const Folder = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc: Create single folder
// @route: POST /api/v1/folders
// @access: Private
exports.createFolder = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const folder = await Folder.create(req.body);
	res.status(201).json({ success: true, data: folder });
});

// @desc: Update single folder
// @route: PUT /api/v1/folders/:id
// @access: Private
exports.updateFolder = asyncHandler(async (req, res, next) => {
	let folder = await Folder.findById(req.params.id);
	if (!folder) return next(new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404));
	if (folder.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to update this folder`, 401));
	folder = await Folder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	res.status(200).json({ success: true, data: folder });
});

// @desc: Delete single folder
// @route: DELETE /api/v1/folders/:id
// @access: Private
exports.deleteFolder = asyncHandler(async (req, res, next) => {
	const folder = await Folder.findById(req.params.id).select('name user');
	if (!folder) return next(new ErrorResponse(`Folder not found with id of ${req.params.id}`, 404));
	if (folder.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete folder`, 401));
	await folder.remove();
	res.status(200).json({ success: true, data: folder });
});