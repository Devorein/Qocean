const express = require('express');
const { getWatchListCount } = require('../controllers/watchlist');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const { FolderModel } = require('../models/Folder');
const { QuizModel } = require('../models/Quiz');

const router = express.Router();
router.route('/folders').get(protect, advancedResults(FolderModel));
router.route('/quizzes').get(protect, advancedResults(QuizModel));
router.route('/:type/count').get(protect, getWatchListCount);
module.exports = router;
