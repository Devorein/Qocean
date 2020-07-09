const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server-express');

const { Models, Typedefs, Resolvers, Routes } = require('./resource');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const { validate } = require('./middleware/auth');
const reportGraphql = require('./utils/reportGraphql');
const generateLimiter = require('./utils/generateLimiter');

dotenv.config({ path: './config/config.env' });

connectDB();

const REST = express();

// REST server
REST.use(cors());
REST.use(express.json());
REST.use(fileupload());
REST.use(helmet());
REST.use(xssClean());
REST.use(generateLimiter());
REST.use(express.static(path.join(__dirname, 'public')));
REST.use(morgan('dev'));

Object.entries(Routes.obj).forEach(([ key, value ]) => {
	REST.use(`/api/v1/${key}`, value);
});

REST.use(cookieParser);
REST.use(errorHandler);

const { REST_PORT = 5000 } = process.env;

const REST_SERVER = REST.listen(REST_PORT, () => {
	console.log(colors.blue.bold(`REST Server running in ${process.env.NODE_ENV} mode on port ${REST_PORT}`));
});

// GRAPHQL Server
const GRAPHQL = express();
GRAPHQL.use(cors());
GRAPHQL.use(validate);
GRAPHQL.use(hpp());
GRAPHQL.use(mongoSanitize());
GRAPHQL.use(errorHandler);
const GRAPHQL_SERVER = new ApolloServer({
	schema: makeExecutableSchema({
		typeDefs: Typedefs.arr,
		resolvers: Resolvers.arr,
		resolverValidationOptions: {
			requireResolversForNonScalar: false
		},
		// resolverValidationOptions: {
		// 	requireResolversForResolveType: false,
		// 	requireResolversForArgs: true,
		// 	requireResolversForNonScalar: true
		// },
		allowUndefinedInResolve: false
	}),
	context: ({ req, res }) => {
		reportGraphql(res);
		return {
			user: req.user,
			...Models.obj,
			req,
			res
		};
	},
	engine: {
		reportSchema: true
	},
	playground: {
		endpoint: '/graphql'
	}
});

const { GRAPHQL_PORT = 5002 } = process.env;
GRAPHQL_SERVER.applyMiddleware({ app: GRAPHQL });

GRAPHQL.listen(GRAPHQL_PORT, () => {
	console.log(colors.magenta.bold(`Graphql Server running in ${process.env.NODE_ENV} mode on port ${GRAPHQL_PORT}`));
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	REST_SERVER.close(() => process.exit(1));
	GRAPHQL_SERVER.close(() => process.exit(1));
});
