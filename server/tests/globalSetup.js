const generateGraphqlServer = require('../servers/graphql');

module.exports = async () => {
	const GRAPHQL_SERVER = await generateGraphqlServer();
	GRAPHQL_SERVER.start();
	const { Typedefs } = GRAPHQL_SERVER.getTypedefsAndResolvers();
	global.Typedefs = Typedefs;
	Object.freeze(global.Typedefs);
};
