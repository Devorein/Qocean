const express = require('express');
const Environment = require('../models/Environment');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');
const {
	getCurrentEnvironment,
	createEnvironment,
	updateEnvironment,
	deleteEnvironment
} = require('../controllers/environment');

router.route('/me').get(protect, advancedResults(Environment, null));
router.route('/current').get(protect, getCurrentEnvironment);

router
	.route('/')
	.get(
		advancedResults(
			Environment,
			{ path: 'user', select: 'username' },
			{
				exclude: [ 'favourite', 'public' ],
				match: { public: true }
			}
		)
	)
	.post(protect, createEnvironment);

router.route('/:id').put(protect, updateEnvironment).delete(protect, deleteEnvironment);

module.exports = router;
