const Mongql = require('mongql');
const path = require('path');

const routes = require('./routes');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

const PreTransformedResolvers = require('./resolvers');

const RoutesArr = [];

Object.values(routes).forEach((route) => {
	RoutesArr.push(route);
});

module.exports = {
	generateTypedefsAndResolvers: async function () {
		const mongql = new Mongql({
			Schemas: path.resolve(__dirname, './models'),
			Typedefs: path.resolve(__dirname, './typedefs'),
			Resolvers: path.resolve(__dirname, './resolvers'),
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
	}
};
