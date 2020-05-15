const express = require('express');
const Folder = require('../models/Folder');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const { createFolder, updateFolder, deleteFolder, quizToFolder } = require('../controllers/folder');

router.route('/me').get(protect, advancedResults(Folder, 'quizzes'));

router
	.route('/')
	.get(
		advancedResults(
			Folder,
			{
				path: 'quizzes',
				select: 'name questionCount'
			},
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
