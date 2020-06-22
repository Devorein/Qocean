const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const rateLimiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const { makeExecutableSchema } = require('graphql-tools');
const { ApolloServer } = require('apollo-server-express');
const { merge } = require('lodash');

const { typeDefs } = require('./schema.js');
const UserSchema = require('./schemas/User.js');
const FolderSchema = require('./schemas/Folder.js');
const { resolvers } = require('./resolvers.js');
const UserResolvers = require('./resolvers/user');
const UserModel = require('./models/User');
const QuizModel = require('./models/Quiz');
const QuestionModel = require('./models/Question');
const FolderModel = require('./models/Folder');
const EnvironmentModel = require('./models/Environment');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const { validate } = require('./middleware/auth');

dotenv.config({ path: './config/config.env' });

const quizzes = require('./routes/quizzes');
const questions = require('./routes/questions');
const auth = require('./routes/auth');
const user = require('./routes/user');
const folder = require('./routes/folders');
const environment = require('./routes/environment');
const report = require('./routes/report');
const watchlist = require('./routes/watchlist');
const filtersort = require('./routes/filtersort');

connectDB();

const REST = express();

let limiter = null;

if (process.env.NODE_ENV === 'development') {
	REST.use(morgan('dev'));
	limiter = rateLimiter({
		windowMs: 10 * 60 * 1000,
		max: 1000
	});
} else {
	limiter = rateLimiter({
		windowMs: 10 * 60 * 1000,
		max: 500
	});
}

// REST server
REST.use(cors());
REST.use(express.json());
REST.use(fileupload());
// REST.use(mongoSanitize());
REST.use(helmet());
REST.use(xssClean());
// REST.use(hpp());
REST.use(limiter);
REST.use(express.static(path.join(__dirname, 'public')));
REST.use('/api/v1/quizzes', quizzes);
REST.use('/api/v1/questions', questions);
REST.use('/api/v1/auth', auth);
REST.use('/api/v1/users', user);
REST.use('/api/v1/folders', folder);
REST.use('/api/v1/environments', environment);
REST.use('/api/v1/reports', report);
REST.use('/api/v1/watchlist', watchlist);
REST.use('/api/v1/filtersort', filtersort);
REST.use(cookieParser);
REST.use(errorHandler);

const { REST_PORT = 5000 } = process.env;

const REST_SERVER = REST.listen(REST_PORT, () => {
	console.log(colors.blue.bold(`REST Server running in ${process.env.NODE_ENV} mode on port ${REST_PORT}`));
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	REST_SERVER.close(() => process.exit(1));
});

// GRAPHQL Server
const GRAPHQL = express();
GRAPHQL.use(cors());
GRAPHQL.use(validate);
GRAPHQL.use(hpp());
GRAPHQL.use(mongoSanitize());

const GRAPHQL_SERVER = new ApolloServer({
	schema: makeExecutableSchema({
		typeDefs: [ typeDefs, UserSchema, FolderSchema ],
		resolvers: merge(resolvers, UserResolvers),
		resolverValidationOptions: {
			requireResolversForResolveType: false
		}
	}),
	context: ({ req }) => {
		return {
			user: req.user,
			User: UserModel,
			Quiz: QuizModel,
			Question: QuestionModel,
			Folder: FolderModel,
			Environment: EnvironmentModel
		};
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
