const { Mongql } = require('mongql');
const path = require('path');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

module.exports = {
	generateTypedefsAndResolvers: async function () {
		const mongql = new Mongql({
			Schemas: path.resolve(__dirname, './models'),
			Typedefs: {
				init: path.resolve(__dirname, './typedefs'),
				base: AuthTypedef
			},
			Resolvers: {
				init: path.resolve(__dirname, './resolvers')
			},
			output: {
				dir: process.cwd() + '\\SDL'
			},
			sort: {
				fields: false,
				nodes: false
			}
		});
		const { TransformedTypedefs, TransformedResolvers } = await mongql.generate();
		TransformedResolvers.arr.push(AuthResolvers);
		const generatedModels = await mongql.generateModels();
		return { TransformedTypedefs, TransformedResolvers, generatedModels };
	}
};
