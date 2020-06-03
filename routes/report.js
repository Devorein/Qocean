const express = require('express');
const { createReport } = require('../controllers/report');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.route('/').post(protect, createReport);
module.exports = router;
