const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server-express');
const colors = require('colors');

const { validate } = require('../middleware/auth');
const { Models, generateTypedefsAndResolvers } = require('../resource');
const reportGraphql = require('../utils/reportGraphql');

module.exports = async function generateGraphqlServer () {
	const { Typedefs, Resolvers } = await generateTypedefsAndResolvers();
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

	return {
		GRAPHQL_SERVER: GRAPHQL,
		start () {
			const { GRAPHQL_PORT = 5002 } = process.env;

			GRAPHQL.listen(GRAPHQL_PORT, () => {
				console.log(
					colors.magenta.bold(
						`Graphql Server running in ${process.env.NODE_ENV} mode on port http://localhost:${GRAPHQL_PORT}/graphql`
					)
				);
			});
		},
		getTypedefsAndResolvers: () => {
			return {
				Typedefs,
				Resolvers
			};
		}
	};
};
