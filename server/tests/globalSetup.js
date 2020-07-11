const GRAPHQL_SERVER = require('../servers/graphql');

console.log('Test started');
module.exports = async () => {
	global.GRAPHQL_SERVER = GRAPHQL_SERVER;
	await global.GRAPHQL_SERVER.listen();
};
