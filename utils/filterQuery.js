module.exports = function filterQuery(req, model) {
	const filters = { ...req.query };
	const excludeFields = [ 'select', 'sort', 'page', 'limit', 'populateFields', 'populate' ];
	excludeFields.forEach((param) => delete filters[param]);
	if (model.modelName === 'User') {
		if (req.route.path === '/others') filters._id = { $ne: req.user._id };
	} else {
		if (req.route.path === '/me') filters.user = req.user._id;
		else if (req.route.path === '/others') {
			filters.user = { $ne: req.user._id };
			filters.public = true;
		} else if (req.route.path === '/') filters.public = true;
	}
	if (req.baseUrl.includes('watchlist')) filters.watchers = { $in: [ req.user._id ] };
	return filters;
};
