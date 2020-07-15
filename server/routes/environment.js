const express = require('express');
const { EnvironmentModel } = require('../models/Environment');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const {
	getCurrentEnvironment,
	createEnvironment,
	updateEnvironment,
	deleteEnvironment,
	deleteEnvironments,
	setCurrentEnvironment,
	updateEnvironments
} = require('../controllers/environment');

router.route('/me').get(protect, advancedResults(EnvironmentModel));

router.route('/countAll').get(advancedResults(EnvironmentModel));
router.route('/countMine').get(protect, advancedResults(EnvironmentModel));
router.route('/countOthers').get(protect, advancedResults(EnvironmentModel));
router.route('/others').get(protect, advancedResults(EnvironmentModel));
router.route('/setcurrent').post(protect, setCurrentEnvironment);

router.route('/current').get(protect, getCurrentEnvironment);

router
	.route('/')
	.get(advancedResults(EnvironmentModel))
	.post(protect, createEnvironment)
	.put(protect, updateEnvironments)
	.delete(protect, deleteEnvironments);

router
	.route('/:id')
	.put(protect, updateEnvironment)
	.delete(protect, deleteEnvironment);

module.exports = router;
