const S = require('string');
const Mongql = require('mongql');

const modelschema = require('./models');

const routes = require('./routes');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

const PreTransformedTypeDefsASTs = require('./typedefs');
const PreTransformedResolvers = require('./resolvers');

const SchemasArr = [];
const SchemasObj = {};

Object.entries(modelschema).forEach(([ resource, value ]) => {
	SchemasObj[S(resource).capitalize().s] = value[1];
	SchemasArr.push(value[1]);
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
		const { TransformedTypedefs, TransformedResolvers } = await mongql.generate();
		TransformedTypedefs.obj.Auth = AuthTypedef;
		TransformedTypedefs.arr.push(AuthTypedef);
		TransformedResolvers.obj.Auth = AuthResolvers;
		TransformedResolvers.arr.push(AuthResolvers);
		const generatedModels = await mongql.generateModels();
		return { TransformedTypedefs, TransformedResolvers, generatedModels };
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
