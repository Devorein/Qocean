const resolverCompose = require('../utils/resolverCompose');

const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');

const FilterSortResolvers = {
	Query: {
		async getAllSelfFilterSorts(parent, args, { user, FilterSort }) {
			return await FilterSort.find({ user: user.id });
		}
	},
	Mutation: {
		...generateMutationResolvers('filtersort')
	},
	...generateTypeResolvers('filtersort')
};

module.exports = resolverCompose(FilterSortResolvers);
