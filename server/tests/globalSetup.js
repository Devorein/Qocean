const colors = require('colors');
const { spawn } = require('child_process');

const GRAPHQL_SERVER = require('../servers/graphql');

const { GRAPHQL_PORT = 5002 } = process.env;

module.exports = async () => {
	global.MONGOD_PROCESS = spawn('mongod');
	global.MONGOD_PROCESS.stdout.once('data', () => {
		global.GRAPHQL_SERVER = GRAPHQL_SERVER.listen(GRAPHQL_PORT, () => {
			console.log(
				colors.magenta.bold(
					`Graphql Server running in ${process.env.NODE_ENV} mode on port http://localhost:${GRAPHQL_PORT}/graphql`
				)
			);
		});
	});
};
