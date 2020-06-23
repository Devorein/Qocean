const parsePagination = require('../utils/parsePagination');
const {
	getCurrentEnvironment,
	createEnvironment,
	updateEnvironment,
	deleteEnvironment,
	deleteEnvironments,
	setCurrentEnvironment,
	updateEnvironments
} = require('../controllers/environment');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedEnvironments(parent, args, { Environment }, info) {
			return await Environment.find({}).select('-public -favourite');
		},
		async getAllMixedEnvironmentsName(parent, args, { Environment }) {
			return await Environment.find({}).select('name');
		},

		async getAllMixedEnvironmentsCount(parent, args, { Environment }) {
			return await Environment.countDocuments({});
		},

		// ? All Others
		async getAllOthersEnvironments(parent, args, { user, Environment }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return await Environment.find({ user: { $ne: user.id } });
		},
		async getAllOthersEnvironmentsName(parent, args, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.find({ user: { $ne: user.id } }).select('name');
		},
		async getAllOthersEnvironmentsCount(parent, args, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.countDocuments({ user: { $ne: user.id } });
		},

		// ? All Self
		async getAllSelfEnvironments(parent, args, { user, Environment }, info) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.find({ user: user.id });
		},
		async getAllSelfEnvironmentsName(parent, args, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.find({ user: user.id }).select('name');
		},
		async getAllSelfEnvironmentsCount(parent, args, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.countDocuments({ user: user.id });
		},

		// ? Paginated Mixed
		async getPaginatedMixedEnvironments(parent, { pagination }, { Environment }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find(filter).sort(sort).skip(page).limit(limit).select('-public -favourite');
		},

		async getPaginatedMixedEnvironmentsName(parent, { pagination }, { user, Environment }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find(filter).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredMixedEnvironmentsCount(parent, { filter = '{}' }, { Environment }) {
			return await Environment.countDocuments(JSON.parse(filter));
		},

		// ? Paginated Others
		async getPaginatedOthersEnvironments(parent, { pagination }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersEnvironmentsName(parent, { pagination }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		async getFilteredOthersEnvironmentsCount(parent, { filter = '{}' }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Environment.countDocuments({ ...JSON.parse(filter), user: { $ne: user.id } });
			return count;
		},

		// ? Paginated Self
		async getPaginatedSelfEnvironments(parent, { pagination }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedSelfEnvironmentsName(parent, { pagination }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredSelfEnvironmentsCount(parent, { filter = '{}' }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Environment.countDocuments({ ...JSON.parse(filter), user: user.id });
			return count;
		},

		// ? Id mixed
		async getMixedEnvironmentsById(parent, { id }, { Environment }) {
			const environment = await Environment.findById(id).select('-public -favourite');
			if (!environment) throw new Error('Resource with that Id doesnt exist');
			return environment;
		},

		// ? Id Others
		async getOthersEnvironmentsById(parent, { id }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ environment ] = await Environment.find({ _id: id, user: { $ne: user.id } }).select(
				'-public -favourite'
			)[0];
			if (!environment) throw new Error('Resource with that Id doesnt exist');
			return environment;
		},

		// ? Id Self
		async getSelfEnvironmentsById(parent, { id }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ environment ] = await Environment.find({ _id: id, user: user.id });
			if (!environment) throw new Error('Resource with that Id doesnt exist');
			return environment;
		}
	}
};
