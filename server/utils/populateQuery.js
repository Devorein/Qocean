module.exports = function populateQuery(query, req) {
	const shouldPopulate = req.query.populate ? true : false;
	if (shouldPopulate) {
		const populations = [];
		const populates = decodeURIComponent(req.query.populate).split(',');
		let { populateFields } = req.query;
		if (populateFields) {
			populateFields = populateFields.split('-');
			populateFields.forEach((populateField, index) => {
				let match = {};
				if (populates[index] !== 'user' && !req.route.path.includes('me'))
					match = {
						match: {
							public: true
						}
					};
				populations.push({
					path: populates[index],
					select: decodeURIComponent(populateField).split(',').join(' '),
					...match
				});
			});
			query.populate(populations);
		} else query.populate(req.query.populate);
	}
};
