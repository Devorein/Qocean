const {
	createEnvironmentHandler,
	deleteEnvironmentHandler,
	setCurrentEnvironmentHandler
} = require('../controllers/environment');
const parsePagination = require('../utils/parsePagination');
const updateResource = require('../utils/updateResource');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedEnvironments(parent, args, { Environment }, info) {
			return await Environment.find({ public: true }).select('-public -favourite');
		},
		async getAllMixedEnvironmentsName(parent, args, { Environment }) {
			return await Environment.find({ public: true }).select('name');
		},

		async getAllMixedEnvironmentsCount(parent, args, { Environment }) {
			return await Environment.countDocuments({ public: true });
		},

		// ? All Others
		async getAllOthersEnvironments(parent, args, { user, Environment }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return await Environment.find({ public: true, user: { $ne: user.id } });
		},
		async getAllOthersEnvironmentsName(parent, args, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.find({ public: true, user: { $ne: user.id } }).select('name');
		},
		async getAllOthersEnvironmentsCount(parent, args, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Environment.countDocuments({ public: true, user: { $ne: user.id } });
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
			return await Environment.find({ ...filter, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedMixedEnvironmentsName(parent, { pagination }, { user, Environment }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, public: true }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredMixedEnvironmentsCount(parent, { filter = '{}' }, { Environment }) {
			return await Environment.countDocuments({ ...JSON.parse(filter), public: true });
		},

		// ? Paginated Others
		async getPaginatedOthersEnvironments(parent, { pagination }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, user: { $ne: user.id }, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersEnvironmentsName(parent, { pagination }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Environment.find({ ...filter, user: { $ne: user.id }, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		async getFilteredOthersEnvironmentsCount(parent, { filter = '{}' }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Environment.countDocuments({ ...JSON.parse(filter), user: { $ne: user.id }, public: true });
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
			const [ environment ] = await Environment.find({ _id: id, public: true }).select('-public -favourite');
			if (!environment) throw new Error('Resource with that Id doesnt exist');
			return environment;
		},

		// ? Id Others
		async getOthersEnvironmentsById(parent, { id }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ environment ] = await Environment.find({ _id: id, user: { $ne: user.id }, public: true }).select(
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
	},
	Mutation: {
		async createEnvironment(parent, { data }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await createEnvironmentHandler(user.id, data, (err) => {
				throw err;
			});
		},
		async setCurrentEnvironment(parent, { id }, { user, Environment }) {
			return await setCurrentEnvironmentHandler(user.id, id);
		},
		async updateEnvironment(parent, { data }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ updated_environment ] = await updateResource(Environment, [ data ], user.id, (err) => {
				throw err;
			});
			return updated_environment;
		},

		async updateEnvironments(parent, { data }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await updateResource(Environment, data, user.id, (err) => {
				throw err;
			});
		},
		async deleteEnvironment(parent, { id }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ environment ] = await deleteEnvironmentHandler([ id ], user.id, user.current_environment, (err) => {
				throw err;
			});
			return environment;
		},
		async deleteEnvironments(parent, { ids }, { user, Environment }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await deleteEnvironmentHandler(ids, user.id, user.current_environment, (err) => {
				throw err;
			});
		}
	},
	SelfEnvironment: {
		theme: (parent) => parent.theme,
		default_question_type: (parent) => parent.default_question_type,
		default_question_difficulty: (parent) => parent.default_question_difficulty,
		keybindings: (parent) => parent.keybindings,
		explore_page: (parent) => parent.explore_page,
		play_page: (parent) => parent.play_page,
		self_page: (parent) => parent.self_page,
		watchlist_page: (parent) => parent.watchlist_page
	},
	OthersEnvironment: {
		theme: (parent) => parent.theme,
		default_question_type: (parent) => parent.default_question_type,
		default_question_difficulty: (parent) => parent.default_question_difficulty,
		keybindings: (parent) => parent.keybindings,
		explore_page: (parent) => parent.explore_page,
		play_page: (parent) => parent.play_page,
		self_page: (parent) => parent.self_page,
		watchlist_page: (parent) => parent.watchlist_page
	},
	PageInfo: {
		default_view: (parent) => parent.default_view
	}
};
