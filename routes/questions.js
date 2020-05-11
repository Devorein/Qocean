const express = require('express');
const router = express.Router({ mergeParams: true });

const { getQuestions } = require('../controllers/questions');

router.route('/').get(getQuestions);

module.exports = router;
