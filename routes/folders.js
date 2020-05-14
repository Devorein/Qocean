const express = require('express');
const Folder = require('../models/Folder');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const { createFolder, updateFolder, deleteFolder } = require('../controllers/folder');

router.route('/me').get(protect, advancedResults(Folder, 'quizes'));

router
	.route('/')
	.get(
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
		)
	)
	.post(protect, createFolder)
	.put(protect, updateFolder)
	.delete(protect, deleteFolder);

module.exports = router;
