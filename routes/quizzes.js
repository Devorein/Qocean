const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const {
	createQuiz,
	updateQuiz,
	deleteQuiz,
	deleteQuizzes,
	quizPhotoUpload,
	updatePlayedTimes
} = require('../controllers/quizzes');

router.route('/me').get(protect, advancedResults(Quiz));
router.route('/countAll').get(advancedResults(Quiz));
router.route('/countMine').get(protect, advancedResults(Quiz));
router.route('/countOthers').get(protect, advancedResults(Quiz));
router.route('/others').get(protect, advancedResults(Quiz));

router
	.route('/')
	.get(
		advancedResults(
			Quiz,
			[
				{
					path: 'questions',
					select: 'name'
				},
				{
					path: 'user',
					select: 'username'
				}
			],
			{
				exclude: [ 'favourite', 'public', '__v', 'folders', 'total_folders' ]
			}
		)
	)
	.post(protect, createQuiz)
	.delete(protect, deleteQuizzes);

router.route('/:id').put(protect, updateQuiz).delete(protect, deleteQuiz);

router.route('/:id/photo').put(protect, imageUpload(Quiz, 'Quiz'), quizPhotoUpload);

router.route('/_/updatePlayedTimes').put(protect, updatePlayedTimes);

module.exports = router;
