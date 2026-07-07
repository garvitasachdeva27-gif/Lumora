const express = require('express');
const protect = require('../middleware/authMiddleware');
const { deleteAccount } = require('../controllers/userController');

const router = express.Router();

router.delete('/account', protect, deleteAccount);

module.exports = router;