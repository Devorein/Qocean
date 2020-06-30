const express = require('express');
const { FolderModel } = require('../models/Folder');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const {
	createFolder,
	updateFolder,
	deleteFolder,
	deleteFolders,
	quizToFolder,
	watchFolders,
	updateFolders
} = require('../controllers/folder');

router.route('/countAll').get(advancedResults(FolderModel));
router.route('/countMine').get(protect, advancedResults(FolderModel));
router.route('/countOthers').get(protect, advancedResults(FolderModel));
router.route('/me').get(protect, advancedResults(FolderModel));
router.route('/others').get(protect, advancedResults(FolderModel));

router
	.route('/')
	.get(advancedResults(FolderModel))
	.post(protect, createFolder)
	.put(protect, updateFolders)
	.delete(protect, deleteFolders);

router.route('/quiz').put(protect, quizToFolder);
router.route('/_/watchFolders').put(protect, watchFolders);

router.route('/:id').put(protect, updateFolder).delete(protect, deleteFolder);

module.exports = router;
