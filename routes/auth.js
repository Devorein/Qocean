const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, checkPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/logout', logout);
router.get('/checkpassword/:password', protect, checkPassword);
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', protect, forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
