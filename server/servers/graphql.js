const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server-express');

const { validate } = require('../middleware/auth');
const { Models, Typedefs, Resolvers } = require('../resource');
const reportGraphql = require('../utils/reportGraphql');

// GRAPHQL Server
const GRAPHQL = express();
GRAPHQL.use(cors());
GRAPHQL.use(validate);
GRAPHQL.use(hpp());
GRAPHQL.use(mongoSanitize());

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

GRAPHQL_SERVER.applyMiddleware({ app: GRAPHQL });

module.exports = GRAPHQL;
