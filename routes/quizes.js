const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const { getQuiz, createQuiz, updateQuiz, deleteQuiz, quizPhotoUpload } = require('../controllers/quizes');

const questionRouter = require('./questions');

router.use('/:quizId/questions', questionRouter);

router
	.route('/')
	.get(async (req, res, next) => {
		if (!req.query.user) {
			await advancedResults(Quiz, null, {
				exclude: [ 'favourite', 'public' ],
				match: { public: true }
			})(req, res);
		} else if (req.query.user && req.query.user !== 'me') {
			await advancedResults(Quiz, null, {
				exclude: [ 'favourite', 'public' ],
				match: { public: true, user: req.query.user }
			})(req, res);
		}
		res.status(200).json(res.advancedResults);
	})
	.post(protect, createQuiz);

router.route('/:id/photo').put(protect, imageUpload(Quiz, 'Quiz'), quizPhotoUpload);

router.route('/:id').get(getQuiz).put(protect, updateQuiz).delete(protect, deleteQuiz);

module.exports = router;
