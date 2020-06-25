const { composeResolvers } = require('@graphql-tools/resolvers-composition');

const isAuthenticated = require('./authResolver');

module.exports = function(resolver) {
	const resolversComposition = {};

	Object.entries(resolver).forEach(([ outerkey, outervalue ]) => {
		if (typeof outervalue === 'object') {
			Object.keys(outervalue).forEach((innerkey) => {
				if (!innerkey.match(/(Mixed)/) && (innerkey.match(/(Self|Others)/) || outerkey.match(/(Mutation)/))) {
					resolversComposition[`${outerkey}.${innerkey}`] = [ isAuthenticated() ];
				}
			});
		}
	});
	return composeResolvers(resolver, resolversComposition);
};
