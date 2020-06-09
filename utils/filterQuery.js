module.exports = function filterQuery(reqQuery) {
	const filters = { ...reqQuery };
	const excludeFields = [ 'select', 'sort', 'page', 'limit', 'populateFields', 'populate' ];
	excludeFields.forEach((param) => delete filters[param]);
	return filters;
};
