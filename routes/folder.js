const express = require('express');
const Folder = require('../models/Folder');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');

const { getFolders } = require('../controllers/folder');

router.route('/').get(
	advancedResults(Folder, null, {
		exclude: [ 'favourite', 'public' ],
		match: { public: true }
	}),
	getFolders
);

module.exports = router;
