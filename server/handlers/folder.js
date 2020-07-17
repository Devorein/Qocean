const { FolderModel } = require('../models/Folder');
const ErrorResponse = require('../utils/errorResponse');

async function createFolderHandler(userId, data, next) {
	data.user = userId;
	const prevFolder = await FolderModel.countDocuments({
		name: data.name,
		user: userId
	});
	if (prevFolder >= 1) {
		if (next)
			return next(
				new ErrorResponse(`You alread have a folder named ${data.name}`, 400)
			);
		else throw new Error(`You alread have a folder named ${data.name}`);
	}
	delete data.quizzes;
	const folder = await FolderModel.create(data);
	return await folder.save();
}

exports.createFolderHandler = createFolderHandler;

async function deleteFolderHandler(folderIds, userId, next) {
	const deleted_folders = [];
	for (let i = 0; i < folderIds.length; i++) {
		const folderId = folderIds[i];
		const folder = await FolderModel.findById(folderId);
		if (!folder)
			return next(
				new ErrorResponse(`FolderModel not found with id of ${folderId}`, 404)
			);
		if (folder.user.toString() !== userId.toString())
			return next(
				new ErrorResponse(`User not authorized to delete folder`, 401)
			);
		await folder.remove();
		deleted_folders.push(folder);
	}
	return deleted_folders;
}

exports.deleteFolderHandler = deleteFolderHandler;
