const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');

const { getQuizes, getQuiz, createQuiz, updateQuiz, deleteQuiz, quizPhotoUpload } = require('../controllers/quizes');

const questionRouter = require('./questions');

router.use('/:quizId/questions', questionRouter);

router.route('/').get(advancedResults(Quiz, 'questions'), getQuizes).post(createQuiz);

router.route('/:id/photo').put(imageUpload(Quiz, 'Quiz'), quizPhotoUpload);

router.route('/:id').get(getQuiz).put(updateQuiz).delete(deleteQuiz);

module.exports = router;
