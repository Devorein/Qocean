const ErrorResponse = require('../utils/errorResponse');

const advancedResults = (model, populate, option = {}) =>
	async function(req, res, next) {
		if (req.query._id) {
			let query = model
				.findOne({ _id: req.query._id, public: true })
				.select(option.exclude.map((field) => `-${field}`).join(' '));
			if (Array.isArray(populate)) populate.forEach((pop) => (query = query.populate(pop)));
			else query = query.populate(populate);
			const result = await query;
			if (!result) return next(new ErrorResponse(`Resource not found with id of ${req.query._id}`, 404));
			res.status(200).json({ success: true, data: result });
		} else {
			let query;
			const reqQuery = { ...req.query };
			// Fields to exclude
			const excludeFields = [ 'select', 'sort', 'page', 'limit' ];
			excludeFields.forEach((param) => delete reqQuery[param]);

			let queryStr = JSON.stringify(reqQuery);

			// Create mongodb operators
			queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
			queryStr = JSON.parse(queryStr);
			option.match = { ...option.match };
			const originalUrls = req.originalUrl.split('/');
			if (originalUrls[originalUrls.length - 1] === 'me') option.match.user = req.user._id;
			queryStr = { ...queryStr, ...option.match };
			query = model.find(queryStr);
			let fields = '';
			if (req.query.select) {
				fields = req.query.select.split(',');
				fields = option && option.exclude ? fields.filter((field) => !option.exclude.includes(field)) : fields;
			} else fields = option && option.exclude ? option.exclude.map((field) => `-${field}`) : '';
			query = query.select(fields);

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

			if (populate) {
				if (Array.isArray(populate)) populate.forEach((pop) => (query = query.populate(pop)));
				else query = query.populate(populate);
			}

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
			res.status(200).json(res.advancedResults);
		}
	};

module.exports = advancedResults;
