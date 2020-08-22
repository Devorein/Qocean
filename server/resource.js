const { Mongql } = require('mongql');
const path = require('path');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

module.exports = {
	generateTypedefsAndResolvers: async function () {
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
			sort: false,
			output: {
				Operation: path.resolve(__dirname, '../client/src/operations')
			},
			Operations: {
				importGql: true
			}
		});
		const { TransformedTypedefs, TransformedResolvers } = await mongql.generate();
		const generatedModels = await mongql.generateModels();
		return { TransformedTypedefs, TransformedResolvers, generatedModels };
	}
};
