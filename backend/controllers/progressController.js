const Progress = require('../models/Progress');

// @route GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ userId: req.user._id }).select('-lastActiveDate');
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }
    res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress };