const colors = require('colors');

const GRAPHQL_SERVER = require('../servers/graphql');
const connectDB = require('../config/db');

const { GRAPHQL_PORT = 5002 } = process.env;

module.exports = async () => {
	connectDB();
	global.GRAPHQL_SERVER = GRAPHQL_SERVER.listen(GRAPHQL_PORT, () => {
		console.log(
			colors.magenta.bold(
				`Graphql Server running in ${process.env.NODE_ENV} mode on port http://localhost:${GRAPHQL_PORT}/graphql`
			)
		);
	});
};
