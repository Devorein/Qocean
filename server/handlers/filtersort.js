const { FilterSortModel } = require('../models/FilterSort');
const ErrorResponse = require('../utils/errorResponse');

exports.deleteFilterSortHandler = async function (ids, userId, next) {
	const deleted_filtersorts = [];
	for (let i = 0; i < ids.length; i++) {
		const environmentId = ids[i];
		const filtersort = await FilterSortModel.findById(environmentId).select(
			'name user'
		);
		if (!filtersort)
			return next(
				new ErrorResponse(
					`Environment not found with id of ${environmentId}`,
					404
				)
			);
		if (filtersort.user.toString() !== userId.toString())
			return next(
				new ErrorResponse(`User not authorized to delete filtersort`, 401)
			);
		await filtersort.remove();
		deleted_filtersorts.push(filtersort);
	}
	return deleted_filtersorts;
};
