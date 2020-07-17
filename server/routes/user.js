const express = require('express');
const { UserModel } = require('../models/User');
const {
	updateUserDetails,
	updateUserPassword,
	deleteUser,
	getMe,
	getUserTags,
	getMyTags,
	userPhotoUpload,
	getAllUsers,
	getAllTags
} = require('../controllers/user');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');

const router = express.Router();

router.route('/').get(advancedResults(UserModel));
router.route('/getAllUsers').get(getAllUsers);
router.route('/countAll').get(advancedResults(UserModel));
router.route('/countOthers').get(protect, advancedResults(UserModel));
router.route('/others').get(protect, advancedResults(UserModel));
router.route('/tags/:id').get(getUserTags);
router.route('/getAllTags').get(getAllTags);
router.route('/tags/_/me').post(protect, getMyTags);

router.route('/').delete(protect, deleteUser).get(advancedResults(UserModel));

router.put('/updatedetails', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);
router.route('/me').get(protect, getMe);
router
	.route('/:id/photo')
	.put(protect, imageUpload(UserModel, 'User'), userPhotoUpload);
module.exports = router;
