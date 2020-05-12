const advancedResults = (model, populate, option) =>
	async function(req, res, next) {
		let query;

		const reqQuery = { ...req.query };

		// Fields to exclude
		const excludeFields = [ 'select', 'sort', 'page', 'limit' ];
		excludeFields.forEach((param) => delete reqQuery[param]);

		let queryStr = JSON.stringify(reqQuery);

		// Create mongodb operators
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
		queryStr = JSON.parse(queryStr);
		if (option && req.params[option.param]) {
			queryStr = { ...queryStr, [option.param.replace('Id', '')]: req.params[option.param] };
			query = model.find(queryStr);
		} else query = model.find(queryStr);
		// Getting the selected fields using projection
		if (req.query.select) {
			const fields = req.query.select.split(',').join(' ');
			query = query.select(fields);
		}

		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else query = query.sort('-createdAt');

		// Pagination
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await model.countDocuments();

		query = query.skip(startIndex).limit(limit);

		if (populate) query = query.populate(populate);

		// Pagination result
		const pagination = {};
		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit
			};
		}

		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit
			};
		}

		const results = await query;

		res.advancedResults = {
			success: true,
			count: results.length,
			pagination,
			data: results
		};

		next();
	};

module.exports = advancedResults;
