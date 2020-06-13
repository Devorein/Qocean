const ErrorResponse = require('../utils/errorResponse');
const populateQuery = require('../utils/populateQuery');
const paginateQuery = require('../utils/paginateQuery');
const sortQuery = require('../utils/sortQuery');
const projectionQuery = require('../utils/projectionQuery');
const filterQuery = require('../utils/filterQuery');
const handleCountRoutes = require('../utils/handleCountRoutes');
const qs = require('qs');
const advancedResults = (model) =>
	async function(req, res, next) {
		if (req.query._id) {
			let filters = {};
			if (!req.user && !req.baseUrl.includes('users')) filters.public = true;
			let query = model.findOne({ _id: req.query._id, ...filters });
			populateQuery(query, req);
			const result = await query;
			if (!result)
				return next(new ErrorResponse(`Resource not found with id of ${req.query._id} or is made private`, 404));
			res.status(200).json({ success: true, data: result });
		} else {
			req.query = qs.parse(req._parsedOriginalUrl.query, { depth: 100 });
			let queryFilters = filterQuery(req, model);
			let processFurther = await handleCountRoutes(queryFilters, req, res, model);
			if (processFurther) {
				const query = model.find(queryFilters);
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
		}
	};

module.exports = advancedResults;
