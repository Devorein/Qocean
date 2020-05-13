const express = require('express');
const Folder = require('../models/Folder');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');

const { getFolders, getFolderById } = require('../controllers/folder');

router.route('/').get(
	advancedResults(Folder, null, {
		exclude: [ 'favourite', 'public' ],
		match: { public: true }
	}),
	getFolders
);

router.route('/:id').get(getFolderById);

module.exports = router;
