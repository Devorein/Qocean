const ErrorResponse = require('../utils/errorResponse');
const populateQuery = require('../utils/populateQuery');
const paginateQuery = require('../utils/paginateQuery');
const sortQuery = require('../utils/sortQuery');

const advancedResults = (model, option = {}) =>
	async function(req, res, next) {
		let filters = {};
		if (req.query._id) {
			if (!req.user) filters.public = true;
			let query = model.findOne({ _id: req.query._id, ...filters });
			populateQuery(query, req);
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

				sortQuery(query, req);
				populateQuery(query, req);
				const pagination = await paginateQuery(query, req, model);
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
