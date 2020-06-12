const FilterSort = require('../models/FilterSort');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getMyFilterSorts = asyncHandler(async (req, res, next) => {
	const filtersorts = await FilterSort.find({ user: req.user._id });
	res.status(200).json({ success: true, data: filtersorts });
});

exports.createFilterSort = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const filtersort = await FilterSort.create(req.body);
	res.status(200).json({ success: true, data: filtersort });
});

exports.deleteFilterSort = asyncHandler(async (req, res, next) => {
	const filtersort = await FilterSort.findById(req.params.id);
	if (!filtersort) return next(new ErrorResponse(`Filtersort not found with id of ${req.params.id}`, 404));
	if (filtersort.user.toString() !== req.user._id.toString())
		return next(new ErrorResponse(`User not authorized to delete filtersort`, 401));
	await filtersort.remove();
	res.status(200).json({ success: true });
});
