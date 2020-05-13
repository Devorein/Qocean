const express = require('express');
const User = require('../models/User');
const { updateUser, deleteUser, getUsers, getMe, getUserById } = require('../controllers/user');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/').put(protect, updateUser).delete(protect, deleteUser).get(
	advancedResults(User, null, {
		exclude: [ 'quizes', 'questions', 'email', 'username' ]
	}),
	getUsers
);
router.route('/me').get(protect, getMe);
router.route('/:userId').get(getUserById);

module.exports = router;
