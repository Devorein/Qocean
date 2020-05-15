const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const { createQuiz, updateQuiz, deleteQuiz, quizPhotoUpload } = require('../controllers/quizzes');

router.route('/me').get(protect, advancedResults(Quiz, 'questions'));

router
	.route('/')
	.get(
		advancedResults(
			Quiz,
			[
				{
					path: 'questions',
					select: 'question'
				},
				{
					path: 'user',
					select: 'username'
				}
			],
			{
				exclude: [ 'favourite', 'public', '__v', 'folders', 'foldersCount' ],
				match: { public: true }
			}
		)
	)
	.post(protect, createQuiz);

router.route('/:id').put(protect, updateQuiz).delete(protect, deleteQuiz);

router.route('/:id/photo').put(protect, imageUpload(Quiz, 'Quiz'), quizPhotoUpload);

module.exports = router;
