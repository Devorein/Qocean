const express = require('express');
const router = express.Router({ mergeParams: true });
const Question = require('../models/Question');
const advancedResults = require('../middleware/advancedResults');

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
	.post(createQuestion);
router.route('/:id').get(getQuestion).put(updateQuestion).delete(deleteQuestion);
router.route('/:id/photo').put(questionPhotoUpload);

module.exports = router;
