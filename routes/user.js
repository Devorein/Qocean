const express = require('express');
const User = require('../models/User');
const {
	updateUserDetails,
	updateUserPassword,
	deleteUser,
	getMe,
	getUserTags,
	getMyTags,
	userPhotoUpload
} = require('../controllers/user');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');

const router = express.Router();

router.route('/countAll').get(advancedResults(User));
router.route('/countOthers').get(protect, advancedResults(User));
router.route('/others').get(protect, advancedResults(User));
router.route('/tags/:id').get(getUserTags);
router.route('/tags/_/me').post(protect, getMyTags);

router.route('/').delete(protect, deleteUser).get(
	advancedResults(User, null, {
		exclude: [ 'quizzes', 'questions', 'email' ],
		_id: {
			populate: [
				{
					path: 'quizzes',
					select: 'name total_questions'
				},
				{
					path: 'questions',
					select: 'name type'
				},
				{
					path: 'folders',
					select: 'name total_quizzes total_questions'
				},
				{
					path: 'environments',
					select: 'name total_quizzes total_questions'
				}
			]
		}
	})
);

router.put('/updatedetails', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);
router.route('/me').get(protect, getMe);
router.route('/:id/photo').put(protect, imageUpload(User, 'User'), userPhotoUpload);
module.exports = router;
