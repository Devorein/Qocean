const { FilterSortModel } = require('../models/FilterSort');
const asyncHandler = require('../middleware/async');
const updateResource = require('../utils/resource/updateResource');
const { deleteFilterSortHandler } = require('../handlers/filtersort');

exports.getMyFilterSorts = asyncHandler(async (req, res) => {
	const filtersorts = await FilterSortModel.find({ user: req.user._id, ...req.query });
	res.status(200).json({ success: true, data: filtersorts });
});

exports.createFilterSort = asyncHandler(async (req, res) => {
	req.body.user = req.user._id;
	const filtersort = await FilterSortModel.create(req.body);
	res.status(200).json({ success: true, data: filtersort });
});

exports.updateFilterSort = asyncHandler(async (req, res, next) => {
	req.body.id = req.params.id;
	const filtersort = await updateResource(req.body, req.user._id, next);
	res.status(200).json({ success: true, data: filtersort });
});

exports.deleteFilterSort = asyncHandler(async (req, res, next) => {
	const filtersort = await deleteFilterSortHandler(req.params.id, req.user._id, next);
	res.status(200).json({ success: true, data: filtersort });
});
