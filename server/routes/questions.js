const express = require('express');
const router = express.Router({ mergeParams: true });
const { QuestionModel } = require('../models/Question');
const advancedResults = require('../middleware/advancedResults');
const imageUpload = require('../middleware/imageUpload');
const { protect } = require('../middleware/auth');

const {
	validateQuestion,
	validateQuestions,
	createQuestion,
	updateQuestion,
	updateQuestions,
	deleteQuestion,
	deleteQuestions,
	questionPhotoUpload,
	sendAnswer,
	sendAnswers,
	getOthersQuestions
} = require('../controllers/questions');

router.route('/countAll').get(advancedResults(QuestionModel));
router.route('/answers/:id').get(protect, sendAnswer);
router.route('/countMine').get(protect, advancedResults(QuestionModel));
router.route('/countOthers').get(protect, advancedResults(QuestionModel));
router.route('/me').get(protect, advancedResults(QuestionModel));
router.route('/others').post(protect, getOthersQuestions);
router.route('/_/validation').put(validateQuestion);
router.route('/_/validations').put(validateQuestions);
router.route('/_/answers').put(protect, sendAnswers);

router
	.route('/')
	.get(advancedResults(QuestionModel))
	.post(protect, createQuestion)
	.put(protect, updateQuestions)
	.delete(protect, deleteQuestions);

router.route('/:id').put(protect, updateQuestion).delete(protect, deleteQuestion);

router.route('/:id/photo').put(protect, imageUpload(QuestionModel, 'Question'), questionPhotoUpload);

module.exports = router;
