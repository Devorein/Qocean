const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const { getQuizes, getQuiz, createQuiz, updateQuiz, deleteQuiz, quizPhotoUpload } = require('../controllers/quizes');

const questionRouter = require('./questions');

router.use('/:quizId/questions', questionRouter);

router.route('/').get(advancedResults(Quiz, 'questions'), getQuizes).post(protect, createQuiz);

router.route('/:id/photo').put(protect, imageUpload(Quiz, 'Quiz'), quizPhotoUpload);

router.route('/:id').get(getQuiz).put(protect, updateQuiz).delete(protect, deleteQuiz);

module.exports = router;
