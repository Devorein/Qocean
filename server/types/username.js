const { GraphQLScalarType, GraphQLError } = require('graphql');
const { Kind } = require('graphql/language');

const { isAlphaNumericOnly } = require('../utils/validation');

module.exports = new GraphQLScalarType({
	name: 'Username',
	description: 'A custom scalar type to represent a well formatted username',
	parseValue: (value) => value,
	serialize: (value) => value,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
			if (
				isAlphaNumericOnly(ast.value) &&
				ast.value.length >= 3 &&
				ast.value.length <= 18
			)
				return ast.value;
			else throw new GraphQLError('Not a well formatted username');
		}
		return null;
	}
});
