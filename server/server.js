const dotenv = require('dotenv');

const generateRestServer = require('./servers/rest');
const generateGraphqlServer = require('./servers/graphql');

let mode = null;
process.argv.forEach((arg) => {
	if (arg.startsWith('--MODE')) mode = arg.split('=')[1];
});

dotenv.config({ path: `./config/${mode}.env` });

const connectDB = require('./config/db');
connectDB();

(async function () {
	const GRAPHQL_SERVER = await generateGraphqlServer();
	GRAPHQL_SERVER.start();

	const REST_SERVER = await generateRestServer();
	REST_SERVER.start();
})();

process.on('unhandledRejection', (err) => {
	console.log(`Error: ${err.message}`.red);
});
