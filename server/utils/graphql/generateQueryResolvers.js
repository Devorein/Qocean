const pluralize = require('pluralize');

const parsePagination = require('../parsePagination');

module.exports = function(resource) {
	const capitalizedResource = resource.charAt(0).toUpperCase() + resource.substr(1);
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	const QueryResolvers = {
		[`getAllMixed${pluralizedcapitalizedResource}`]: async function(parent, args, ctx, info) {
			return await ctx[capitalizedResource].find({ public: true }).select('-public -favourite');
		},
		[`getAllMixed${pluralizedcapitalizedResource}Name`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].find({ public: true }).select('name');
		},
		[`getAllMixed${pluralizedcapitalizedResource}Count`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].countDocuments({ public: true });
		},
		[`getAllOthers${pluralizedcapitalizedResource}`]: async function(parent, args, ctx, info) {
			return await ctx[capitalizedResource].find({ public: true, user: { $ne: ctx.user.id } });
		},
		[`getAllOthers${pluralizedcapitalizedResource}Name`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].find({ public: true, user: { $ne: ctx.user.id } }).select('name');
		},
		[`getAllOthers${pluralizedcapitalizedResource}Count`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].countDocuments({ public: true, user: { $ne: ctx.user.id } });
		},
		[`getAllSelf${pluralizedcapitalizedResource}`]: async function(parent, args, ctx, info) {
			return await ctx[capitalizedResource].find({ user: ctx.user.id });
		},
		[`getAllSelf${pluralizedcapitalizedResource}Name`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].find({ user: ctx.user.id }).select('name');
		},
		[`getAllSelf${pluralizedcapitalizedResource}Count`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].countDocuments({ user: ctx.user.id });
		},
		[`getPaginatedMixed${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		[`getPaginatedMixed${pluralizedcapitalizedResource}Name`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredMixed${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			return await ctx[capitalizedResource].countDocuments({ ...JSON.parse(filter), public: true });
		},
		[`getPaginatedMixed${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		[`getPaginatedMixed${pluralizedcapitalizedResource}Name`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredMixed${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			return await ctx[capitalizedResource].countDocuments({ ...JSON.parse(filter), public: true });
		},

		// ? Paginated Others
		[`getPaginatedOthers${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, user: { $ne: ctx.user.id }, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		[`getPaginatedOthers${pluralizedcapitalizedResource}Name`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, user: { $ne: ctx.user.id }, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredOthers${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			const count = await ctx[capitalizedResource].countDocuments({
				...JSON.parse(filter),
				user: { $ne: ctx.user.id },
				public: true
			});
			return count;
		},

		// ? Paginated Self
		[`getPaginatedSelf${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource].find({ ...filter, user: ctx.user.id }).sort(sort).skip(page).limit(limit);
		},

		[`getPaginatedSelf${pluralizedcapitalizedResource}Name`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, user: ctx.user.id })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredSelf${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			const count = await ctx[capitalizedResource].countDocuments({ ...JSON.parse(filter), user: ctx.user.id });
			return count;
		},

		// ? Id mixed
		[`getMixed${pluralizedcapitalizedResource}ById`]: async function(parent, { id }, ctx) {
			const [ folder ] = await ctx[capitalizedResource].find({ _id: id, public: true }).select('-public -favourite');
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		},

		// ? Id Others
		[`getOthers${pluralizedcapitalizedResource}ById`]: async function(parent, { id }, ctx) {
			const [ folder ] = await ctx[capitalizedResource]
				.find({ _id: id, user: { $ne: ctx.user.id }, public: true })
				.select('-public -favourite')[0];
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		},

		// ? Id Self
		[`getSelf${pluralizedcapitalizedResource}ById`]: async function(parent, { id }, ctx) {
			const [ folder ] = await ctx[capitalizedResource].find({ _id: id, user: ctx.user.id });
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		}
	};
	return QueryResolvers;
};
