const FilterSortResolvers = {
	resolver: {
		Query: {
			async getAllSelfFilterSorts(parent, args, { user, FilterSort }) {
				return await FilterSort.find({ user: user.id });
			}
		},
		Mutation: {}
	},
	generate: {
		mutation: true,
		type: true
	}
};

module.exports = FilterSortResolvers;
