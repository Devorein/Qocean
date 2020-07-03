const {
	createEnvironmentHandler,
	deleteEnvironmentHandler,
	setCurrentEnvironmentHandler
} = require('../handlers/environment');

const updateResource = require('../utils/resource/updateResource');
const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');

const EnvironmentResolvers = {
	Query: {
		...generateQueryResolvers('environment')
	},
	Mutation: {
		async setCurrentEnvironment(parent, { id }, { user, Environment }) {
			return await setCurrentEnvironmentHandler(user.id, id);
		},
		...generateMutationResolvers('environment')
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
