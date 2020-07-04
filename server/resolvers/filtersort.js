const { updateFilterSortHandler, deleteFilterSortHandler } = require('../handlers/filtersort');
const resolverCompose = require('../utils/resolverCompose');

const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

const FilterSortResolvers = {
	Query: {
		async getAllSelfFilterSorts(parent, args, { user, FilterSort }) {
			return await FilterSort.find({ user: user.id });
		}
	},
	Mutation: {
		async createFilterSort(parent, { data }, { user, FilterSort }) {
			data.user = user.id;
			return await FilterSort.create(data);
		},
		async updateFilterSort(parent, { data }, { user }) {
			data.id = user.id;
			return await updateFilterSortHandler(data, user.id, (err) => {
				throw err;
			});
		},
		async deleteFilterSort(parent, { id }, { user }) {
			return await deleteFilterSortHandler(id, user.id, (err) => {
				throw err;
			});
		}
	},
	...generateTypeResolvers('filtersort')
};

module.exports = resolverCompose(FilterSortResolvers);
