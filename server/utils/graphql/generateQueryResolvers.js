const pluralize = require('pluralize');
const S = require('String');
const { difference } = require('lodash');

const parsePagination = require('../parsePagination');

module.exports = function(resource) {
	const capitalizedResource = S(resource).capitalize().s;
	const selfFields = [],
		mixedFields = [],
		othersFields = [];
	Object.entries(global.Schema[capitalizedResource].fields).forEach(([ key, { excludePartitions } ]) => {
		if (excludePartitions === undefined) excludePartitions = [];
		if (!excludePartitions.includes('Mixed')) mixedFields.push(key);
		if (!excludePartitions.includes('Others')) othersFields.push(key);
		if (!excludePartitions.includes('Self')) selfFields.push(key);
	});

	const exlcudedMixedFields = difference(selfFields, mixedFields);
	const exlcudedOthersFields = difference(selfFields, othersFields);
	const exlcudedMixedFieldsStr = exlcudedMixedFields.map((item) => `-${item}`).join(' ');
	const exlcudedOthersFieldsStr = exlcudedOthersFields.map((item) => `-${item}`).join(' ');

	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	const nonUserFilter = {};
	if (resource !== 'user') nonUserFilter.public = true;
	const selfQueries = {
		// ? Id Self
		[`getSelf${pluralizedcapitalizedResource}ById`]: async function(parent, { id }, ctx) {
			const [ folder ] = await ctx[capitalizedResource].find({ _id: id, user: ctx.user.id });
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		},
		// ? Paginated Self
		[`getPaginatedSelf${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource].find({ ...filter, user: ctx.user.id }).sort(sort).skip(page).limit(limit);
		},

		[`getPaginatedSelf${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			{ pagination },
			ctx
		) {
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
		[`getAllSelf${pluralizedcapitalizedResource}`]: async function(parent, args, ctx, info) {
			return await ctx[capitalizedResource].find({ user: ctx.user.id });
		},
		[`getAllSelf${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			args,
			ctx
		) {
			return await ctx[capitalizedResource].find({ user: ctx.user.id }).select('name');
		},
		[`getAllSelf${pluralizedcapitalizedResource}Count`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].countDocuments({ user: ctx.user.id });
		}
	};

	let QueryResolvers = {
		[`getAllMixed${pluralizedcapitalizedResource}`]: async function(parent, args, ctx, info) {
			const resources = await ctx[capitalizedResource].find({ ...nonUserFilter }).select(exlcudedMixedFieldsStr);
			console.log(resources);
			return resources;
		},
		[`getAllMixed${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			args,
			ctx
		) {
			return await ctx[capitalizedResource].find({ ...nonUserFilter }).select('name');
		},
		[`getAllMixed${pluralizedcapitalizedResource}Count`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].countDocuments({ ...nonUserFilter });
		},
		[`getAllOthers${pluralizedcapitalizedResource}`]: async function(parent, args, ctx, info) {
			return await ctx[capitalizedResource]
				.find({ ...nonUserFilter, user: { $ne: ctx.user.id } })
				.select(exlcudedOthersFieldsStr);
		},
		[`getAllOthers${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			args,
			ctx
		) {
			return await ctx[capitalizedResource].find({ ...nonUserFilter, user: { $ne: ctx.user.id } }).select('name');
		},
		[`getAllOthers${pluralizedcapitalizedResource}Count`]: async function(parent, args, ctx) {
			return await ctx[capitalizedResource].countDocuments({ ...nonUserFilter, user: { $ne: ctx.user.id } });
		},

		[`getPaginatedMixed${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, ...nonUserFilter })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select(exlcudedMixedFieldsStr);
		},

		[`getPaginatedMixed${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			{ pagination },
			ctx
		) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, ...nonUserFilter })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredMixed${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			return await ctx[capitalizedResource].countDocuments({ ...JSON.parse(filter), ...nonUserFilter });
		},
		[`getPaginatedMixed${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, ...nonUserFilter })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		[`getPaginatedMixed${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			{ pagination },
			ctx
		) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, ...nonUserFilter })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredMixed${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			return await ctx[capitalizedResource].countDocuments({ ...JSON.parse(filter), ...nonUserFilter });
		},

		// ? Paginated Others
		[`getPaginatedOthers${pluralizedcapitalizedResource}`]: async function(parent, { pagination }, ctx) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, user: { $ne: ctx.user.id }, ...nonUserFilter })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select(exlcudedOthersFieldsStr);
		},

		[`getPaginatedOthers${pluralizedcapitalizedResource}${resource === 'user' ? 'Username' : 'Name'}`]: async function(
			parent,
			{ pagination },
			ctx
		) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await ctx[capitalizedResource]
				.find({ ...filter, user: { $ne: ctx.user.id }, ...nonUserFilter })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		[`getFilteredOthers${pluralizedcapitalizedResource}Count`]: async function(parent, { filter = '{}' }, ctx) {
			const count = await ctx[capitalizedResource].countDocuments({
				...JSON.parse(filter),
				user: { $ne: ctx.user.id },
				...nonUserFilter
			});
			return count;
		},

		// ? Id mixed
		[`getMixed${pluralizedcapitalizedResource}ById`]: async function(parent, { id }, ctx) {
			const [ folder ] = await ctx[capitalizedResource]
				.find({ _id: id, ...nonUserFilter })
				.select(exlcudedMixedFieldsStr);
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		},

		// ? Id Others
		[`getOthers${pluralizedcapitalizedResource}ById`]: async function(parent, { id }, ctx) {
			const [ folder ] = await ctx[capitalizedResource]
				.find({ _id: id, user: { $ne: ctx.user.id }, ...nonUserFilter })
				.select(exlcudedOthersFieldsStr);
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		}
	};
	if (resource !== 'user') QueryResolvers = { ...QueryResolvers, ...selfQueries };
	return QueryResolvers;
};
