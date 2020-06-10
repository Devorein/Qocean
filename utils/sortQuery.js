module.exports = function sortQuery(query, req) {
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query.sort(sortBy);
	} else query.sort('-created_at -name');
};
