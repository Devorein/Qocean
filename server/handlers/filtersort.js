const FilterSort = require('../models/FilterSort');
const ErrorResponse = require('../utils/errorResponse');

exports.updateFilterSortHandler = async function(data, userId, next) {
	let filtersort = await FilterSort.findById(data.id);
	if (!filtersort) return next(new ErrorResponse(`Filtersort not found with id of ${data.id}`, 404));
	if (filtersort.user.toString() !== userId.toString())
		return next(new ErrorResponse(`User not authorized to delete filtersort`, 401));
	delete data.id;
	Object.values(data).forEach(([ key, value ]) => {
		filtersort[key] = value;
	});

	return await filtersort.save();
};

exports.deleteFilterSortHandler = async function(id, userId, next) {
	const filtersort = await FilterSort.findById(id);
	if (!filtersort) return next(new ErrorResponse(`Filtersort not found with id of ${id}`, 404));
	if (filtersort.user.toString() !== userId.toString())
		return next(new ErrorResponse(`User not authorized to delete filtersort`, 401));
	return await filtersort.remove();
};
