const resolverCompose = require('../utils/resolverCompose');

const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');
const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

const FolderResolvers = {
	Query: {
		...generateQueryResolvers('folder')
	},
	Mutation: {
		...generateMutationResolvers('folder')
	},
	...generateTypeResolvers('folder')
};

module.exports = resolverCompose(FolderResolvers);
