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
