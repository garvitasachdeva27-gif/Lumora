const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getProfile, updateProfile, resetProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/reset', protect, resetProfile);

module.exports = router;