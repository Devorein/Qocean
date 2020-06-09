const ErrorResponse = require('../utils/errorResponse');
const populateQuery = require('../utils/populateQuery');
const paginateQuery = require('../utils/paginateQuery');
const sortQuery = require('../utils/sortQuery');
const projectionQuery = require('../utils/projectionQuery');
const filterQuery = require('../utils/filterQuery');
const handleCountRoutes = require('../utils/handleCountRoutes');

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
		}

		let queryFilters = filterQuery(req.query);
		const processFurther = await handleCountRoutes(queryFilters, req, res, model);
		if (processFurther) {
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

			const query = model.find({ ...filters, ...option.match });

			projectionQuery(query, req);
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
	};

module.exports = advancedResults;
