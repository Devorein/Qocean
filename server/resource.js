const S = require('string');
const { typeDefs: ExternalTypeDef, resolvers: ExternalResolvers } = require('graphql-scalars');
const Mongql = require('mongql');

const modelschema = require('./models');

const routes = require('./routes');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

const BaseTypedef = require('./typedefs/Base');
const BaseResolvers = require('./resolvers/base');

const PreTransformedTypeDefsASTs = require('./typedefs');
const PreTransformedResolvers = require('./resolvers');

const ModelsArr = [];
const ModelsObj = {};
const SchemasArr = [];
const SchemasObj = {};

Object.entries(modelschema).forEach(([ resource, [ model, schema ] ]) => {
	ModelsObj[S(resource).capitalize().s] = model;
	ModelsArr.push(model);
	SchemasObj[S(resource).capitalize().s] = schema;
	SchemasArr.push(schema);
});

const RoutesArr = [];
Object.values(routes).forEach((route) => {
	RoutesArr.push(route);
});

module.exports = {
	generateTypedefsAndResolvers: async function () {
		const mongql = new Mongql({
			Schemas: SchemasArr,
			Typedefs: {
				init: PreTransformedTypeDefsASTs
			},
			Resolvers: {
				init: PreTransformedResolvers
			},
			output: {
				dir: process.cwd() + '\\SDL'
			}
		});

		// mutations (resource, { capitalized, pluralized }) {
		//   if (resource.match(/(quiz|folder)/))
		//     return {

		//     };
		// }

		const { TransformedResolvers, TransformedTypedefs } = await mongql.generate();

		const TypedefsArr = TransformedTypedefs.arr;
		const TypedefsObj = TransformedTypedefs.obj;
		const ResolversArr = TransformedResolvers.arr;
		const ResolversObj = TransformedResolvers.obj;

		[
			[ 'Auth', AuthTypedef, AuthResolvers ],
			[ 'Base', BaseTypedef, BaseResolvers ],
			[ 'External', ExternalTypeDef, ExternalResolvers ]
		].forEach(([ key, typedef, resolver ]) => {
			TypedefsObj[key] = typedef;
			if (Array.isArray(typedef)) TypedefsArr.push(...typedef);
			else TypedefsArr.push(typedef);
			ResolversObj[key] = resolver;
			ResolversArr.push(resolver);
		});

		return {
			Typedefs: {
				obj: TypedefsObj,
				arr: TypedefsArr
			},
			Resolvers: {
				obj: ResolversObj,
				arr: ResolversArr
			}
		};
	},
	Models: {
		obj: ModelsObj,
		arr: ModelsArr
	},
	Routes: {
		obj: routes,
		arr: RoutesArr
	},
	Schemas: {
		obj: SchemasObj,
		arr: SchemasArr
	}
};
