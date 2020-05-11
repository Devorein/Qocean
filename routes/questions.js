const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	getQuestions,
	getQuestion,
	createQuestion,
	updateQuestion,
	deleteQuestion
} = require('../controllers/questions');

router.route('/').get(getQuestions).post(createQuestion);
router.route('/:id').get(getQuestion).put(updateQuestion).delete(deleteQuestion);

module.exports = router;
