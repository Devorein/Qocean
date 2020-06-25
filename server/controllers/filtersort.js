const FilterSort = require('../models/FilterSort');
const asyncHandler = require('../middleware/async');
const { updateFilterSortHandler, deleteFilterSortHandler } = require('../handlers/filtersort');

exports.getMyFilterSorts = asyncHandler(async (req, res, next) => {
	const filtersorts = await FilterSort.find({ user: req.user._id, ...req.query });
	res.status(200).json({ success: true, data: filtersorts });
});

exports.createFilterSort = asyncHandler(async (req, res, next) => {
	req.body.user = req.user._id;
	const filtersort = await FilterSort.create(req.body);
	res.status(200).json({ success: true, data: filtersort });
});

exports.updateFilterSort = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const filtersort = await updateFilterSortHandler(req.body, req.user._id, next);
	res.status(200).json({ success: true, data: filtersort });
});

exports.deleteFilterSort = asyncHandler(async (req, res, next) => {
	const filtersort = await deleteFilterSortHandler(req.params.id, req.user._id, next);
	res.status(200).json({ success: true, data: filtersort });
});
