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
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs: ExternalTypeDefs, resolvers: ExternalResolvers } = require('graphql-scalars');
const S = require('string');

const { typeDefs } = require('./schema.js');
const AuthSchema = require('./schemas/Auth.js');
const UserSchema = require('./schemas/User.js');
const QuizSchema = require('./schemas/Quiz.js');
const QuestionSchema = require('./schemas/Question.js');
const FolderSchema = require('./schemas/Folder.js');
const EnvironmentSchema = require('./schemas/Environment.js');
const WatchlistSchema = require('./schemas/Watchlist.js');
const FilterSortSchema = require('./schemas/FilterSort.js');
const ReportSchema = require('./schemas/Report.js');
const InboxSchema = require('./schemas/Inbox.js');
const MessageSchema = require('./schemas/Message.js');
const { resolvers } = require('./resolvers.js');
const AuthResolvers = require('./resolvers/auth');
const UserResolvers = require('./resolvers/user');
const QuizResolvers = require('./resolvers/quiz');
const QuestionResolvers = require('./resolvers/question');
const FolderResolvers = require('./resolvers/folder');
const EnvironmentResolvers = require('./resolvers/environment');
const WatchlistResolvers = require('./resolvers/watchlist');
const FilterSortResolvers = require('./resolvers/filtersort');
const ReportResolvers = require('./resolvers/report');
const InboxResolvers = require('./resolvers/inbox');
const MessaggeResolvers = require('./resolvers/message');

const models = require('./models');

const Models = {};
Object.entries(models).forEach(([ key, [ model ] ]) => {
	Models[S(key).capitalize().s] = model;
});

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
const GRAPHQL_OPS = {};
const GRAPHQL = express();
GRAPHQL.use(cors());
GRAPHQL.use(validate);
GRAPHQL.use(hpp());
GRAPHQL.use(mongoSanitize());
GRAPHQL.use(errorHandler);
const GRAPHQL_SERVER = new ApolloServer({
	schema: makeExecutableSchema({
		typeDefs: [
			...ExternalTypeDefs,
			typeDefs,
			AuthSchema,
			UserSchema,
			QuizSchema,
			QuestionSchema,
			FolderSchema,
			EnvironmentSchema,
			WatchlistSchema,
			FilterSortSchema,
			ReportSchema,
			InboxSchema,
			MessageSchema
		],
		resolvers: [
			resolvers,
			ExternalResolvers,
			AuthResolvers,
			UserResolvers,
			QuizResolvers,
			QuestionResolvers,
			FolderResolvers,
			EnvironmentResolvers,
			WatchlistResolvers,
			FilterSortResolvers,
			ReportResolvers,
			InboxResolvers
			// MessaggeResolvers
		],
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
		const { operationName, variables } = res.req.body;
		GRAPHQL_OPS[operationName] = GRAPHQL_OPS[operationName] ? GRAPHQL_OPS[operationName] + 1 : 1;
		console.log(GRAPHQL_OPS[operationName], operationName, variables);
		return {
			user: req.user,
			...Models,
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
