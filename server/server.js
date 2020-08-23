const express = require('express');
const { Mongql } = require('mongql');
const path = require('path');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { ApolloServer } = require('apollo-server-express');
const colors = require('colors');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const fileupload = require('express-fileupload');
// const cookieParser = require('cookie-parser');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');
const { validate } = require('./middleware/auth');
const reportGraphql = require('./utils/reportGraphql');

module.exports = async function generateGraphqlServer () {
	const mongql = new Mongql({
		Schemas: path.resolve(__dirname, './schemas'),
		Typedefs: {
			init: path.resolve(__dirname, './typedefs'),
			base: AuthTypedef
		},
		Resolvers: {
			init: path.resolve(__dirname, './resolvers'),
			base: AuthResolvers
		},
		sort: false
		/* output: {
			Operation: path.resolve(__dirname, '../client/src/operations/Operations.js')
		},
		Operations: {
			importGql: true
		} */
	});
	const { TransformedTypedefs, TransformedResolvers } = await mongql.generate();
	const generatedModels = await mongql.generateModels();
	// GRAPHQL Server
	const GRAPHQL = express();
	GRAPHQL.use(cors());
	GRAPHQL.use(validate);
	GRAPHQL.use(hpp());
	GRAPHQL.use(mongoSanitize());
	GRAPHQL.use(express.static(path.join(__dirname, 'public')));
	GRAPHQL.use(fileupload());
	// GRAPHQL.use(cookieParser);

	const GRAPHQL_SERVER = new ApolloServer({
		schema: makeExecutableSchema({
			typeDefs: TransformedTypedefs.DocumentNode,
			resolvers: TransformedResolvers.arr,
			resolverValidationOptions: {
				requireResolversForArgs: true,
				requireResolversForNonScalar: true
			},
			allowUndefinedInResolve: false
		}),
		context: ({ req, res }) => {
			reportGraphql(res);
			return {
				user: req.user,
				...generatedModels,
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
			const { GRAPHQL_PORT = 5008 } = process.env;

			GRAPHQL.listen(GRAPHQL_PORT, () => {
				console.log(
					colors.magenta.bold(
						`Graphql Server running in ${process.env.NODE_ENV} mode on port http://localhost:${GRAPHQL_PORT}/graphql`
					)
				);
			});
		}
	};
};
