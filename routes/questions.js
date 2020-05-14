const express = require('express');
const router = express.Router({ mergeParams: true });
const Question = require('../models/Question');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const { createQuestion, updateQuestion, deleteQuestion, questionPhotoUpload } = require('../controllers/questions');

router.route('/me').get(protect, advancedResults(Question));

router
	.route('/')
	.get(
		advancedResults(Question, null, {
			exclude: [ 'favourite', 'public', '__v' ],
			match: { public: true }
		})
	)
	.post(protect, createQuestion)
	.put(protect, updateQuestion)
	.delete(protect, deleteQuestion);

router.route('/photo').put(protect, imageUpload(Question, 'Question'), questionPhotoUpload);

module.exports = router;
