const express = require('express');
const Folder = require('../models/Folder');
const publicRouter = express.Router({ mergeParams: true });
const privateRouter = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const { getFolders, getFolderById, getCurrentUserFolders } = require('../controllers/folder');

privateRouter.route('/').get(protect, advancedResults(Folder), getCurrentUserFolders);
publicRouter.route('/').get(
	advancedResults(Folder, null, {
		exclude: [ 'favourite', 'public' ],
		match: { public: true }
	}),
	getFolders
);

publicRouter.route('/:id').get(getFolderById);

module.exports = {
	privateFolderRouter: privateRouter,
	publicFolderRouter: publicRouter
};
