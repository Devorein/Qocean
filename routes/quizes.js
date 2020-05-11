const express = require('express');
const router = express.Router();

const { getQuizes, getQuiz, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizes');

const questionRouter = require('./questions');

// Reroute into other resource router
router.use('/:quizId/questions', questionRouter);

router.route('/').get(getQuizes).post(createQuiz);

router.route('/:id').get(getQuiz).put(updateQuiz).delete(deleteQuiz);

module.exports = router;
