const express = require('express');
const router = express.Router({ mergeParams: true });
const Question = require('../models/Question');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const {
	validateQuestion,
	createQuestion,
	updateQuestion,
	deleteQuestion,
	questionPhotoUpload,
	sendAnswer
} = require('../controllers/questions');

router.route('/countAll').get(advancedResults(Question));
router.route('/answers/:id').get(protect, sendAnswer);
router.route('/countMine').get(protect, advancedResults(Question));
router.route('/countOthers').get(protect, advancedResults(Question));
router.route('/me').get(protect, advancedResults(Question));
router.route('/others').get(protect, advancedResults(Question));
router.route('/validation').get(validateQuestion);

router
	.route('/')
	.get(
		advancedResults(
			Question,
			[
				{
					path: 'user',
					select: 'username'
				},
				{
					path: 'quiz',
					select: 'name'
				}
			],
			{
				exclude: [ 'favourite', 'public', '__v', 'add_to_score', 'weight' ]
			}
		)
	)
	.post(protect, createQuestion);
router.route('/:id').put(protect, updateQuestion).delete(protect, deleteQuestion);

router.route('/:id/photo').put(protect, imageUpload(Question, 'Question'), questionPhotoUpload);

module.exports = router;
