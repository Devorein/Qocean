const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

exports.resolvers = {
	Mutation: {},
	JSON: GraphQLJSON,
	JSONObject: GraphQLJSONObject
};
