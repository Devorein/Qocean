const express = require('express');
const Folder = require('../models/Folder');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const { createFolder, updateFolder, deleteFolder, quizToFolder } = require('../controllers/folder');

router.route('/countAll').get(advancedResults(Folder));
router.route('/countMine').get(protect, advancedResults(Folder));
router.route('/countOthers').get(protect, advancedResults(Folder));
router.route('/me').get(protect, advancedResults(Folder, null));
router.route('/others').get(protect, advancedResults(Folder));

router
	.route('/')
	.get(
		advancedResults(
			Folder,
			[
				{
					path: 'quizzes',
					select: 'name total_questions'
				},
				{
					path: 'user',
					select: 'username'
				}
			],
			{
				exclude: [ 'favourite', 'public' ],
				match: { public: true }
			}
		)
	)
	.post(protect, createFolder);

router.route('/quiz').put(quizToFolder);

router.route('/:id').put(protect, updateFolder).delete(protect, deleteFolder);

module.exports = router;
