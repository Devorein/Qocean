const express = require('express');
const router = express.Router();
const { QuizModel } = require('../models/Quiz');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const {
	createQuiz,
	updateQuiz,
	deleteQuiz,
	deleteQuizzes,
	quizPhotoUpload,
	updatePlayedTimes,
	updateQuizRatings,
	watchQuizzes,
	updateQuizzes,
	playPageQuiz
} = require('../controllers/quizzes');

router.route('/me').get(protect, advancedResults(QuizModel));
router.route('/countAll').get(advancedResults(QuizModel));
router.route('/countMine').get(protect, advancedResults(QuizModel));
router.route('/countOthers').get(protect, advancedResults(QuizModel));
router.route('/others').get(protect, advancedResults(QuizModel));

router
	.route('/')
	.get(advancedResults(QuizModel))
	.post(protect, createQuiz)
	.put(protect, updateQuizzes)
	.delete(protect, deleteQuizzes);

router.route('/:id').put(protect, updateQuiz).delete(protect, deleteQuiz);
router
	.route('/:id/photo')
	.put(protect, imageUpload(QuizModel, 'Quiz'), quizPhotoUpload);
router.route('/_/watchQuizzes').put(protect, watchQuizzes);
router.route('/playPageQuiz').get(protect, playPageQuiz);
router.route('/_/ratings').put(protect, updateQuizRatings);
router.route('/_/updatePlayedTimes').put(protect, updatePlayedTimes);

module.exports = router;
