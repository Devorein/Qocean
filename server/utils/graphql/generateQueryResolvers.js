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

	const excludeStrs = {
		Self: '',
		Others: exlcudedOthersFieldsStr,
		Mixed: exlcudedMixedFieldsStr
	};

	const AuthFilters = {
		Self: (ctx) => ({ user: ctx.user.id }),
		Others: (ctx) => ({ user: { $ne: ctx.user.id } }),
		Mixed: () => ({})
	};

	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	const QueryResolvers = {};

	const Pagination = async (auth, args, ctx) => {
		const { page, limit, sort, filter } = parsePagination(args.pagination);
		return ctx[capitalizedResource].find({ ...filter, ...AuthFilters[auth](ctx) }).sort(sort).skip(page).limit(limit);
	};

	const Filter = async (auth, args, ctx) => {
		const { filter = '{}' } = args;
		return ctx[capitalizedResource].find({
			...JSON.parse(filter),
			...AuthFilters[auth](ctx)
		});
	};

	// ? All

	[ 'All', 'Paginated', 'Filtered', 'Id' ].forEach((range) => {
		[ 'Mixed', 'Others', 'Self' ].forEach((auth) => {
			const parts = range.match(/(Id|Paginated)/) ? [ 'Whole', 'NameAndId' ] : [ 'Whole', 'NameAndId', 'Count' ];
			parts.forEach((part) => {
				QueryResolvers[`get${range}${auth}${pluralizedcapitalizedResource}${part}`] = async function(
					parent,
					args,
					ctx
				) {
					const AuthFilter = AuthFilters[auth](ctx);
					if (part === 'Count') {
						if (range === 'All') return await ctx[capitalizedResource].countDocuments({ ...AuthFilter });
						else if (range === 'Filtered')
							return await ctx[capitalizedResource].countDocuments({ ...AuthFilter, ...(args.filter || '{}') });
					}

					let query = null;

					if (range === 'All') query = ctx[capitalizedResource].find({ ...AuthFilter });
					else if (range === 'Paginated') query = Pagination(auth, args, ctx);
					else if (range === 'Filter') query = Filter(auth, args, ctx);
					else if (range === 'Id') query = ctx[capitalizedResource].find({ ...AuthFilter, _id: args.id });

					if (part === 'NameAndId') query = query.select('name');
					else query = query.select(excludeStrs[auth]);
					const res = await query;
					return range === 'Id' ? res[0] : res;
				};
			});
		});
	});

	return QueryResolvers;
};
