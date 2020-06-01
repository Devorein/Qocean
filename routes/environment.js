const express = require('express');
const Environment = require('../models/Environment');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const {
	getCurrentEnvironment,
	createEnvironment,
	updateEnvironment,
	deleteEnvironment,
	deleteEnvironments,
	setCurrentEnvironment
} = require('../controllers/environment');

router.route('/me').get(protect, advancedResults(Environment, null));

router.route('/countAll').get(advancedResults(Environment));
router.route('/countMine').get(protect, advancedResults(Environment));
router.route('/countOthers').get(protect, advancedResults(Environment));
router.route('/others').get(protect, advancedResults(Environment));
router.route('/setcurrent').post(protect, setCurrentEnvironment);

router.route('/current').get(protect, getCurrentEnvironment);

router
	.route('/')
	.get(
		advancedResults(
			Environment,
			{ path: 'user', select: 'username' },
			{
				exclude: [ 'favourite', 'public' ]
			}
		)
	)
	.post(protect, createEnvironment)
	.delete(protect, deleteEnvironments);

router.route('/:id').put(protect, updateEnvironment).delete(protect, deleteEnvironment);

module.exports = router;
