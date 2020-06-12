const express = require('express');
const { getMyFilterSorts, createFilterSort, deleteFilterSort } = require('../controllers/filtersort');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/me').get(protect, getMyFilterSorts);
router.route('/').post(protect, createFilterSort);
router.route('/:id').delete(protect, deleteFilterSort);

module.exports = router;
