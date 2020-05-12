const express = require('express');
const router = express.Router({ mergeParams: true });
const Question = require('../models/Question');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const {
	getQuestions,
	getQuestion,
	createQuestion,
	updateQuestion,
	deleteQuestion,
	questionPhotoUpload
} = require('../controllers/questions');

router
	.route('/')
	.get(
		advancedResults(
			Question,
			{
				path: 'quiz',
				select: 'name'
			},
			{
				param: 'quizId'
			}
		),
		getQuestions
	)
	.post(protect, createQuestion);
router.route('/:id').get(getQuestion).put(protect, updateQuestion).delete(protect, deleteQuestion);
router.route('/:id/photo').put(protect, imageUpload(Question, 'Question'), questionPhotoUpload);

module.exports = router;
