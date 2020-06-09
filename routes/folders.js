const express = require('express');
const Folder = require('../models/Folder');
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

router.route('/countAll').get(advancedResults(Folder));
router.route('/countMine').get(protect, advancedResults(Folder));
router.route('/countOthers').get(protect, advancedResults(Folder));
router.route('/me').get(protect, advancedResults(Folder));
router.route('/others').get(protect, advancedResults(Folder));

router
	.route('/')
	.get(
		advancedResults(Folder, {
			exclude: [ 'favourite', 'public' ]
		})
	)
	.post(protect, createFolder)
	.put(protect, updateFolders)
	.delete(protect, deleteFolders);

router.route('/quiz').put(protect, quizToFolder);
router.route('/_/watchFolders').put(protect, watchFolders);

router.route('/:id').put(protect, updateFolder).delete(protect, deleteFolder);

module.exports = router;
