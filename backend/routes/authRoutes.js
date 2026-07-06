const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Basic brute-force protection on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

module.exports = router;