const dotenv = require('dotenv');
const colors = require('colors');

const REST_SERVER = require('./servers/rest');
const GRAPHQL_SERVER = require('./servers/graphql');

let mode = null;
process.argv.forEach((arg) => {
	if (arg.startsWith('--MODE')) mode = arg.split('=')[1];
});

dotenv.config({ path: `./config/${mode}.env` });

const connectDB = require('./config/db');
connectDB();

const { REST_PORT = 5000 } = process.env;

REST_SERVER.listen(REST_PORT, () => {
	console.log(
		colors.blue.bold(`REST Server running in ${process.env.NODE_ENV} mode on port http://localhost:${REST_PORT}`)
	);
});

const { GRAPHQL_PORT = 5002 } = process.env;

GRAPHQL_SERVER.listen(GRAPHQL_PORT, () => {
	console.log(
		colors.magenta.bold(
			`Graphql Server running in ${process.env.NODE_ENV} mode on port http://localhost:${GRAPHQL_PORT}/graphql`
		)
	);
});

process.on('unhandledRejection', (err) => {
	console.log(`Error: ${err.message}`.red);
	REST_SERVER.close(() => process.exit(1));
});
