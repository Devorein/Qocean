const parsePagination = require('../utils/parsePagination');
const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');
const addRatings = require('../utils/addRatings');

const { createFolderHandler, deleteFolderHandler } = require('../handlers/folder');
const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/generateQueryResolvers');

const FolderResolvers = {
	Query: {
		...generateQueryResolvers('folder')
	},
	Mutation: {
		async createFolder(parent, { data }, { user, Folder }) {
			return await createFolderHandler(user.id, data, (err) => {
				throw err;
			});
		},
		async updateFolder(parent, { data }, { user, Folder }) {
			const [ updated_folder ] = await updateResource(Folder, [ data ], user.id, (err) => {
				throw err;
			});
			return updated_folder;
		},

		async updateFolders(parent, { data }, { user, Folder }) {
			return await updateResource(Folder, data, user.id, (err) => {
				throw err;
			});
		},
		async updateFolderRatings(parent, { data }, { user, Folder }) {
			return await addRatings(Folder, data, user.id, (err) => {
				throw err;
			});
		},
		async updateFolderWatch(parent, { ids }, { user, User }) {
			user = await User.findById(user.id);
			return watchAction('folders', { folders: ids }, user);
		},
		async deleteFolder(parent, { id }, { user, Folder }) {
			const [ folder ] = await deleteFolderHandler([ id ], user.id, (err) => {
				throw err;
			});
			return folder;
		},
		async deleteFolders(parent, { ids }, { user, Folder }) {
			return await deleteFolderHandler(ids, user.id, (err) => {
				throw err;
			});
		}
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
