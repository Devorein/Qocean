module.exports = function projectionQuery(query, req) {
	let { select } = req.query;
	if (req.route.path !== '/me') select = `-public -favourite`;
	query.select(select);
};
