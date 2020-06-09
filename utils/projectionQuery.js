module.exports = function projectionQuery(query, req) {
	query.select(req.query.select);
};
