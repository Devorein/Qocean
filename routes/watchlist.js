const express = require('express');
const { getWatchList, getWatchListCount } = require('../controllers/watchlist');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.route('/:type').get(protect, getWatchList);
router.route('/:type/count').get(protect, getWatchListCount);
module.exports = router;
