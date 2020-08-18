const FilterSortResolvers = {
	Query: {
		async getAllSelfFiltersorts (parent, args, { user, FilterSort }) {
			return await FilterSort.find({ user: user.id });
		}
	},
	Mutation: {}
};

module.exports = FilterSortResolvers;
