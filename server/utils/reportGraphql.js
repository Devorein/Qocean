const GRAPHQL_OPS = {};

module.exports = function(res) {
	const { operationName, variables } = res.req.body;
	GRAPHQL_OPS[operationName] = GRAPHQL_OPS[operationName] ? GRAPHQL_OPS[operationName] + 1 : 1;
	console.log(GRAPHQL_OPS[operationName], operationName, variables);
};
