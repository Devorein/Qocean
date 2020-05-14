const express = require('express');
const Folder = require('../models/Folder');
const publicRouter = express.Router({ mergeParams: true });
const privateRouter = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const {
	getFolders,
	getFolderById,
	getCurrentUserFolders,
	createFolder,
	updateFolder,
	deleteFolder
} = require('../controllers/folder');

privateRouter.use(protect);
privateRouter.route('/').get(advancedResults(Folder, 'quizes'), getCurrentUserFolders).post(createFolder);
privateRouter.route('/:id').put(updateFolder).delete(deleteFolder);
publicRouter.route('/').get(
	advancedResults(
		Folder,
		{
			path: 'quizes',
			select: 'name questionCount'
		},
		{
			exclude: [ 'favourite', 'public' ],
			match: { public: true }
		}
	),
	getFolders
);

publicRouter.route('/:id').get(getFolderById);

module.exports = {
	privateFolderRouter: privateRouter,
	publicFolderRouter: publicRouter
};
