const express = require('express');
const router = express.Router({ mergeParams: true });

const { getQuestions, getQuestion } = require('../controllers/questions');

router.route('/').get(getQuestions);
router.route('/:id').get(getQuestion);

module.exports = router;
