const express = require('express');
const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const cors = require('cors');

const router = express.Router();

router.get('/logout', logout);
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', protect, forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
