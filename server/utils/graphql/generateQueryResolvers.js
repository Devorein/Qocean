const pluralize = require('pluralize');
const S = require('String');
const { difference } = require('lodash');

const parsePagination = require('../parsePagination');

module.exports = function(resource, transformedSchema) {
	const capitalizedResource = S(resource).capitalize().s;
	const selfFields = [],
		mixedFields = [],
		othersFields = [];

	const { mongql: { queries } } = transformedSchema;

	Object.entries(transformedSchema.fields).forEach(([ key, { excludePartitions } ]) => {
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
	const QueryResolvers = {};

	// ? All
	QueryResolvers[`getAllSelf${pluralizedcapitalizedResource}Whole`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].find({ user: ctx.user.id });
	};
	QueryResolvers[`getAllSelf${pluralizedcapitalizedResource}NameAndId`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].find({ user: ctx.user.id }).select('name');
	};
	QueryResolvers[`getAllSelf${pluralizedcapitalizedResource}Count`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].countDocuments({ user: ctx.user.id });
	};

	QueryResolvers[`getAllOthers${pluralizedcapitalizedResource}Whole`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource]
			.find({ ...nonUserFilter, user: { $ne: ctx.user.id } })
			.select(exlcudedOthersFieldsStr);
	};
	QueryResolvers[`getAllOthers${pluralizedcapitalizedResource}NameAndId`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].find({ ...nonUserFilter, user: { $ne: ctx.user.id } }).select('name');
	};
	QueryResolvers[`getAllOthers${pluralizedcapitalizedResource}Count`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].countDocuments({ ...nonUserFilter, user: { $ne: ctx.user.id } });
	};

	QueryResolvers[`getAllMixed${pluralizedcapitalizedResource}Whole`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].find({ ...nonUserFilter }).select(exlcudedMixedFieldsStr);
	};
	QueryResolvers[`getAllMixed${pluralizedcapitalizedResource}NameAndId`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].find({ ...nonUserFilter }).select('name');
	};
	QueryResolvers[`getAllMixed${pluralizedcapitalizedResource}Count`] = async function(parent, args, ctx) {
		return await ctx[capitalizedResource].countDocuments({ ...nonUserFilter });
	};

	// ? Paginated

	QueryResolvers[`getPaginatedSelf${pluralizedcapitalizedResource}Whole`] = async function(
		parent,
		{ pagination },
		ctx
	) {
		const { page, limit, sort, filter } = parsePagination(pagination);
		return await ctx[capitalizedResource]
			.find({ ...filter, user: { $ne: ctx.user.id } })
			.sort(sort)
			.skip(page)
			.limit(limit)
			.select(exlcudedMixedFieldsStr);
	};
	QueryResolvers[`getPaginatedSelf${pluralizedcapitalizedResource}NameAndId`] = async function(
		parent,
		{ pagination },
		ctx
	) {
		const { page, limit, sort, filter } = parsePagination(pagination);
		return await ctx[capitalizedResource]
			.find({ ...filter, user: { $ne: ctx.user.id } })
			.sort(sort)
			.skip(page)
			.limit(limit)
			.select('name');
	};

	QueryResolvers[`getPaginatedOthers${pluralizedcapitalizedResource}Whole`] = async function(
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
			.select(exlcudedOthersFieldsStr);
	};

	QueryResolvers[`getPaginatedOthers${pluralizedcapitalizedResource}NameAndId`] = async function(
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
	};

	QueryResolvers[`getPaginatedMixed${pluralizedcapitalizedResource}Whole`] = async function(
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
			.select(exlcudedMixedFieldsStr);
	};
	QueryResolvers[`getPaginatedMixed${pluralizedcapitalizedResource}NameAndId`] = async function(
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
	};

	// ? Filtered
	QueryResolvers[`getFilteredSelf${pluralizedcapitalizedResource}Whole`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].find({
			...JSON.parse(filter),
			user: { $eq: ctx.user.id },
			...nonUserFilter
		});
	};
	QueryResolvers[`getFilteredSelf${pluralizedcapitalizedResource}NameAndId`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource]
			.find({ ...filter, user: { $eq: ctx.user.id }, ...nonUserFilter })
			.select('name');
	};
	QueryResolvers[`getFilteredSelf${pluralizedcapitalizedResource}Count`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].countDocuments({
			...JSON.parse(filter),
			user: { $eq: ctx.user.id },
			...nonUserFilter
		});
	};

	QueryResolvers[`getFilteredOthers${pluralizedcapitalizedResource}Whole`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].find({
			...JSON.parse(filter),
			user: { $neq: ctx.user.id },
			...nonUserFilter
		});
	};
	QueryResolvers[`getFilteredOthers${pluralizedcapitalizedResource}NameAndId`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource]
			.find({ ...filter, user: { $neq: ctx.user.id }, ...nonUserFilter })
			.select('name');
	};
	QueryResolvers[`getFilteredOthers${pluralizedcapitalizedResource}Count`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].countDocuments({
			...JSON.parse(filter),
			user: { $neq: ctx.user.id },
			...nonUserFilter
		});
	};

	QueryResolvers[`getFilteredMixed${pluralizedcapitalizedResource}Whole`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].find({ ...filter, ...nonUserFilter }).select(exlcudedMixedFieldsStr);
	};
	QueryResolvers[`getFilteredMixed${pluralizedcapitalizedResource}NameAndId`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].find({ ...filter, ...nonUserFilter }).select('name');
	};
	QueryResolvers[`getFilteredMixed${pluralizedcapitalizedResource}Count`] = async function(
		parent,
		{ filter = '{}' },
		ctx
	) {
		return await ctx[capitalizedResource].countDocuments({ ...JSON.parse(filter), ...nonUserFilter });
	};

	// ? Id
	QueryResolvers[`getIdSelf${pluralizedcapitalizedResource}Whole`] = async function(parent, { id }, ctx) {
		const [ resource ] = await ctx[capitalizedResource].find({ _id: id, user: ctx.user.id });
		if (!resource) throw new Error('Resource with that Id doesnt exist');
		return resource;
	};
	QueryResolvers[`getIdSelf${pluralizedcapitalizedResource}NameAndId`] = async function(parent, { id }, ctx) {
		const [ resource ] = await ctx[capitalizedResource].find({ _id: id, user: ctx.user.id }).select('name');
		if (!resource) throw new Error('Resource with that Id doesnt exist');
		return resource;
	};

	QueryResolvers[`getIdOthers${pluralizedcapitalizedResource}Whole`] = async function(parent, { id }, ctx) {
		const [ resource ] = await ctx[capitalizedResource].find({ _id: id, user: { $ne: ctx.user.id } });
		if (!resource) throw new Error('Resource with that Id doesnt exist');
		return resource;
	};
	QueryResolvers[`getIdOthers${pluralizedcapitalizedResource}NameAndId`] = async function(parent, { id }, ctx) {
		const [ resource ] = await ctx[capitalizedResource].find({ _id: id, user: { $ne: ctx.user.id } }).select('name');
		if (!resource) throw new Error('Resource with that Id doesnt exist');
		return resource;
	};

	QueryResolvers[`getIdMixed${pluralizedcapitalizedResource}Whole`] = async function(parent, { id }, ctx) {
		const [ resource ] = await ctx[capitalizedResource].find({ _id: id }).select(exlcudedMixedFieldsStr);
		if (!resource) throw new Error('Resource with that Id doesnt exist');
		return resource;
	};
	QueryResolvers[`getIdMixed${pluralizedcapitalizedResource}NameAndId`] = async function(parent, { id }, ctx) {
		const [ resource ] = await ctx[capitalizedResource].find({ _id: id }).select('name');
		if (!resource) throw new Error('Resource with that Id doesnt exist');
		return resource;
	};

	return QueryResolvers;
};
