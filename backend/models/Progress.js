const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    topicsCompleted: { type: Number, default: 0 },
    quizzesAttempted: { type: Number, default: 0 },
    averageQuizScore: { type: Number, default: 0 },
    studyStreak: { type: Number, default: 0 },
    totalStudySessions: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 }, // minutes
    lastActiveDate: {
      type: Date,
      default: null, // used internally to calculate streaks — not sent to frontend
    },
    activityHistory: {
      type: [
        {
          type: { type: String }, // e.g. "chat", "quiz", "topic_completed"
          detail: String,
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);