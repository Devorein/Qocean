const express = require('express');
const router = express.Router({ mergeParams: true });

const { getQuestions, getQuestion, createQuestion } = require('../controllers/questions');

router.route('/').get(getQuestions).post(createQuestion);
router.route('/:id').get(getQuestion);

module.exports = router;
