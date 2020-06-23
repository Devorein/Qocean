const parsePagination = require('../utils/parsePagination');
const {
	createFolder,
	updateFolder,
	deleteFolder,
	deleteFolders,
	folderToFolder,
	watchFolders,
	updateFolders
} = require('../controllers/folder');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedFolders(parent, args, { Folder }, info) {
			return await Folder.find({}).select('-public -favourite');
		},
		async getAllMixedFoldersName(parent, args, { Folder }) {
			return await Folder.find({}).select('name');
		},

		async getAllMixedFoldersCount(parent, args, { Folder }) {
			return await Folder.countDocuments({});
		},

		// ? All Others
		async getAllOthersFolders(parent, args, { user, Folder }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return await Folder.find({ user: { $ne: user.id } });
		},
		async getAllOthersFoldersName(parent, args, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Folder.find({ user: { $ne: user.id } }).select('name');
		},
		async getAllOthersFoldersCount(parent, args, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Folder.countDocuments({ user: { $ne: user.id } });
		},

		// ? All Self
		async getAllSelfFolders(parent, args, { user, Folder }, info) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Folder.find({ user: user.id });
		},
		async getAllSelfFoldersName(parent, args, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Folder.find({ user: user.id }).select('name');
		},
		async getAllSelfFoldersCount(parent, args, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Folder.countDocuments({ user: user.id });
		},

		// ? Paginated Mixed
		async getPaginatedMixedFolders(parent, { pagination }, { Folder }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Folder.find(filter).sort(sort).skip(page).limit(limit).select('-public -favourite');
		},

		async getPaginatedMixedFoldersName(parent, { pagination }, { user, Folder }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Folder.find(filter).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredMixedFoldersCount(parent, { filter = '{}' }, { Folder }) {
			return await Folder.countDocuments(JSON.parse(filter));
		},

		// ? Paginated Others
		async getPaginatedOthersFolders(parent, { pagination }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Folder.find({ ...filter, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersFoldersName(parent, { pagination }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Folder.find({ ...filter, user: { $ne: user.id } }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredOthersFoldersCount(parent, { filter = '{}' }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Folder.countDocuments({ ...JSON.parse(filter), user: { $ne: user.id } });
			return count;
		},

		// ? Paginated Self
		async getPaginatedSelfFolders(parent, { pagination }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Folder.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedSelfFoldersName(parent, { pagination }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Folder.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredSelfFoldersCount(parent, { filter = '{}' }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Folder.countDocuments({ ...JSON.parse(filter), user: user.id });
			return count;
		},

		// ? Id mixed
		async getMixedFoldersById(parent, { id }, { Folder }) {
			const folder = await Folder.findById(id).select('-public -favourite');
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		},

		// ? Id Others
		async getOthersFoldersById(parent, { id }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ folder ] = await Folder.find({ _id: id, user: { $ne: user.id } }).select('-public -favourite')[0];
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		},

		// ? Id Self
		async getSelfFoldersById(parent, { id }, { user, Folder }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ folder ] = await Folder.find({ _id: id, user: user.id });
			if (!folder) throw new Error('Resource with that Id doesnt exist');
			return folder;
		}
	}
};
