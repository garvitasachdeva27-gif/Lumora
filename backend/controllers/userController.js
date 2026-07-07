const bcrypt = require('bcryptjs');
const User = require('../models/User');
const LearningProfile = require('../models/LearningProfile');
const Progress = require('../models/Progress');
const Chat = require('../models/Chat');

// @route DELETE /api/account
// Requires the user's current password as confirmation — permanent, cascading delete
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password confirmation is required' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Cascade delete everything tied to this user
    await Promise.all([
      LearningProfile.deleteOne({ userId: req.user._id }),
      Progress.deleteOne({ userId: req.user._id }),
      Chat.deleteMany({ userId: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ]);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { deleteAccount };