const {
	createEnvironmentHandler,
	deleteEnvironmentHandler,
	setCurrentEnvironmentHandler
} = require('../handlers/environment');
const updateResource = require('../utils/resource/updateResource');
const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');

const EnvironmentResolvers = {
	Query: {
		...generateQueryResolvers('environment')
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
		keybindings: (parent) => parent.keybindings,
		explore_page: (parent) => parent.explore_page,
		play_page: (parent) => parent.play_page,
		self_page: (parent) => parent.self_page,
		watchlist_page: (parent) => parent.watchlist_page,
		icon: (parent) => parent.icon,
		question_info: (parent) => parent.question_info
	},
	OthersEnvironment: {
		theme: (parent) => parent.theme,
		keybindings: (parent) => parent.keybindings,
		explore_page: (parent) => parent.explore_page,
		play_page: (parent) => parent.play_page,
		self_page: (parent) => parent.self_page,
		watchlist_page: (parent) => parent.watchlist_page,
		icon: (parent) => parent.icon,
		question_info: (parent) => parent.question_info
	},
	PageInfoType: {
		default_view: (parent) => parent.default_view,
		default_ipp: (parent) => parent.default_ipp,
		default_landing: (parent) => parent.default_landing,
		default_layout: (parent) => parent.default_layout
	},
	QuestionInfoType: {
		default_type: (parent) => parent.default_type,
		default_difficulty: (parent) => parent.default_difficulty,
		default_timing: (parent) => parent.default_timing,
		default_weight: (parent) => parent.default_weight
	}
};

module.exports = resolverCompose(EnvironmentResolvers);
