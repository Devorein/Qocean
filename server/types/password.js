const { GraphQLScalarType, GraphQLError } = require('graphql');
const { Kind } = require('graphql/language');

const { isStrongPassword } = require('../utils/validation');

module.exports = new GraphQLScalarType({
	name: 'Password',
	description: 'A custom scalar type to represent strong password',
	parseValue: (value) => value,
	serialize: (value) => value,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
			if (isStrongPassword(ast.value)) return ast.value;
			else throw new GraphQLError('Password is not strong enough');
		}
		return null;
	}
});
