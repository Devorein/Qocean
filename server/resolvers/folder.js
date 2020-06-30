const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/generateQueryResolvers');
const generateMutationResolves = require('../utils/generateMutationResolves');

const FolderResolvers = {
	Query: {
		...generateQueryResolvers('folder')
	},
	Mutation: {
		...generateMutationResolves('folder')
	},
	SelfFolder: {
		async watchers(parent, args, { User }) {
			return await User.findById(parent.user);
		},
		async quizzes(parent, args, { Quiz }) {
			return await Quiz.find({ user: parent.user });
		},
		icon: (parent) => parent.icon
	},
	OthersFolder: {
		async watchers(parent, args, { User }) {
			return await User.findById(parent.user);
		},
		async quizzes(parent, args, { Quiz }) {
			return await Quiz.find({ user: parent.user, public: true }).select('-public -favourite');
		},
		icon: (parent) => parent.icon
	}
};

module.exports = resolverCompose(FolderResolvers);
