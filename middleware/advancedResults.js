const ErrorResponse = require('../utils/errorResponse');

const advancedResults = (model, populate, option = {}) =>
	async function(req, res, next) {
		if (req.query._id) {
			option._id = { ...option._id };
			option._id.exclude = option._id.exclude || [];
			option._id.populate = option._id.populate || null;
			if (!req.user) option.match = { public: true };
			let query = model
				.findOne({ _id: req.query._id, ...option.match })
				.select(option._id.exclude.map((field) => `-${field}`).join(' '));
			// console.log(req.user, option);
			if (option._id.populate) {
				if (Array.isArray(option._id.populate)) option._id.populate.forEach((pop) => (query = query.populate(pop)));
				else query = query.populate(option._id.populate);
			}
			const result = await query;
			if (!result)
				return next(new ErrorResponse(`Resource not found with id of ${req.query._id} or is made private`, 404));
			res.status(200).json({ success: true, data: result });
		} else {
			if (req.route.path.includes('count')) {
				let match = {};
				if (req.route.path === '/countAll') {
					if (model.modelName !== 'User')
						match = {
							public: true
						};
				} else if (req.route.path === '/countMine')
					match = {
						user: req.user._id
					};
				else if (req.route.path === '/countOthers') {
					if (model.modelName !== 'User')
						match = {
							public: true,
							user: { $ne: req.user._id }
						};
					else
						match = {
							_id: { $ne: req.user._id }
						};
				}

				const count = await model.countDocuments(match);
				res.status(200).json({ success: true, data: count });
			} else {
				let query;
				let reqQuery = { ...req.query };
				const excludeFields = [ 'select', 'sort', 'page', 'limit', 'populateFields', 'populate' ];
				excludeFields.forEach((param) => delete reqQuery[param]);

				reqQuery = JSON.stringify(reqQuery);

				reqQuery = reqQuery.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
				reqQuery = JSON.parse(reqQuery);
				option.match = { ...option.match };
				if (model.modelName === 'User') {
					if (req.route.path === '/others') option.match._id = { $ne: req.user._id };
				} else {
					if (req.route.path === '/me') option.match.user = req.user._id;
					else if (req.route.path === '/others') {
						option.match.user = { $ne: req.user._id };
						option.match = {
							...option.match,
							public: true
						};
					} else if (req.route.path === '/')
						option.match = {
							...option.match,
							public: true
						};
				}
				if (req.baseUrl.includes('watchlist'))
					option.match = {
						...option.match,
						watchers: { $in: [ req.user._id ] }
					};
				reqQuery = { ...reqQuery, ...option.match };
				query = model.find(reqQuery);
				let fields = '';
				if (req.query.select) {
					fields = req.query.select.split(',');
					fields = option && option.exclude ? fields.filter((field) => !option.exclude.includes(field)) : fields;
				} else fields = option && option.exclude ? option.exclude.map((field) => `-${field}`) : '';
				query = query.select(fields);

				if (req.query.sort) {
					const sortBy = req.query.sort.split(',').join(' ');
					query = query.sort(sortBy);
				} else query = query.sort('-created_at');

				// Pagination
				const page = parseInt(req.query.page) || 1;
				const limit = parseInt(req.query.limit) || 10;
				const shouldPopulate = req.query.populate ? true : false;
				const startIndex = (page - 1) * limit;
				const endIndex = page * limit;
				const total = await model.countDocuments();

				query = query.skip(startIndex).limit(limit);
				if (shouldPopulate) {
					const populations = [];
					const populates = req.query.populate.split(',');
					let { populateFields } = req.query;
					if (populateFields) {
						populateFields = populateFields.split('-');
						populateFields.forEach((populateField, index) => {
							populations.push({
								populate: populates[index],
								select: populateField.split(',').join(' ')
							});
						});
						query.populate(populates);
					}
				} else if (populate) {
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
		}
	};

module.exports = advancedResults;
