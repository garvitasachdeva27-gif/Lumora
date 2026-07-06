const mongoose = require('mongoose');

const learningProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one profile per user
    },
    preferredLanguage: {
      type: String,
      enum: ['English', 'Hindi', 'Hinglish'],
      default: 'English',
    },
    preferredStyle: {
      type: [String], // e.g. ["Examples", "Step-by-step"]
      default: [],
    },
    learningPace: {
      type: String,
      enum: ['Slow', 'Balanced', 'Fast'],
      default: 'Balanced',
    },
    currentGoal: {
      type: String,
      default: '',
    },
    weakTopics: {
      type: [String],
      default: [],
    },
    recentTopics: {
      type: [String],
      default: [],
    },
    aiInsights: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningProfile', learningProfileSchema);