const { updateFilterSortHandler, deleteFilterSortHandler } = require('../handlers/filtersort');
const resolverCompose = require('../utils/resolverCompose');

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
	FilterSortType: {
		type(parent) {
			return parent.type;
		},
		async user(parent, args, { user, User }) {
			return await User.findById(user.id);
		},
		filters(parent) {
			return parent.filters;
		},
		sorts(parent) {
			return parent.sorts;
		}
	},
	FilterItem: {
		children(parent) {
			return parent.children;
		},
		cond(parent) {
			return parent.cond;
		}
	},
	SortItem: {
		order(parent) {
			return parent.order;
		}
	}
};

module.exports = resolverCompose(FilterSortResolvers);
