const express = require('express');
const router = express.Router();

const { getQuizes, getQuiz, createQuiz, updateQuiz, deleteQuiz, quizPhotoUpload } = require('../controllers/quizes');

const questionRouter = require('./questions');

router.use('/:quizId/questions', questionRouter);

router.route('/').get(getQuizes).post(createQuiz);

router.route('/:id/photo').put(quizPhotoUpload);

router.route('/:id').get(getQuiz).put(updateQuiz).delete(deleteQuiz);

module.exports = router;
