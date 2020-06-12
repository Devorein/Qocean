const express = require('express');
const { getMyFilterSorts, createFilterSort } = require('../controllers/filtersort');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/me').get(protect, getMyFilterSorts);
router.route('/').post(protect, createFilterSort);

module.exports = router;
