const LearningProfile = require('../models/LearningProfile');

// @route GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await LearningProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Learning profile not found' });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/profile
// Only lets the user manually edit fields your PRD explicitly names as editable:
// language, learning pace, learning goal, teaching preferences.
// weakTopics / recentTopics / aiInsights stay AI-controlled only.
const ALLOWED_FIELDS = ['preferredLanguage', 'preferredStyle', 'learningPace', 'currentGoal'];

const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided to update' });
    }

    const profile = await LearningProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Learning profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};
// @route POST /api/profile/reset
// Clears all AI-learned data, keeping the profile document but resetting it to defaults
const resetProfile = async (req, res, next) => {
  try {
    const profile = await LearningProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          preferredLanguage: 'English',
          preferredStyle: [],
          learningPace: 'Balanced',
          currentGoal: '',
          weakTopics: [],
          recentTopics: [],
          aiInsights: [],
        },
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Learning profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, resetProfile };