const express = require('express');
const User = require('../models/User');
const { updateUserDetails, updateUserPassword, deleteUser, getMe, getUserById } = require('../controllers/user');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/').delete(protect, deleteUser).get(
	advancedResults(User, null, {
		exclude: [ 'quizzes', 'questions', 'email' ]
	})
);
router.route('/:id').get(getUserById);

router.put('/updatedetails', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);
router.route('/me').get(protect, getMe);
module.exports = router;
