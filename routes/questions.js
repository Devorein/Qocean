const express = require('express');
const router = express.Router({ mergeParams: true });
const Question = require('../models/Question');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const {
	countAllQuestions,
	countMyQuestions,
	createQuestion,
	updateQuestion,
	deleteQuestion,
	questionPhotoUpload
} = require('../controllers/questions');

router.route('/me').get(protect, advancedResults(Question));
router.route('/countAll').get(countAllQuestions);
router.route('/countMine').get(protect, countMyQuestions);
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
				exclude: [ 'favourite', 'public', '__v', 'add_to_score', 'weight' ],
				match: { public: true }
			}
		)
	)
	.post(protect, createQuestion);
router.route('/:id').put(protect, updateQuestion).delete(protect, deleteQuestion);

router.route('/:id/photo').put(protect, imageUpload(Question, 'Question'), questionPhotoUpload);

module.exports = router;
