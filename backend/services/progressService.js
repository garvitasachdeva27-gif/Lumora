const Progress = require('../models/Progress');

// Returns true if two dates fall on the same calendar day
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Returns true if `a` is exactly the calendar day right after `b`
function isNextDay(a, b) {
  const nextDay = new Date(b);
  nextDay.setDate(nextDay.getDate() + 1);
  return isSameDay(a, nextDay);
}

// Called whenever the user does something meaningful (chat, quiz, etc.)
// Updates streak + session count + activity log. Never touches quiz-score math.
async function recordActivity(userId, type, detail) {
  const progress = await Progress.findOne({ userId });
  if (!progress) return; // should never happen — created at registration

  const now = new Date();

  if (!progress.lastActiveDate) {
    progress.studyStreak = 1;
    progress.totalStudySessions += 1;
  } else if (isSameDay(now, progress.lastActiveDate)) {
    // Same day — activity counts, but doesn't start a new "session" or bump streak again
  } else if (isNextDay(now, progress.lastActiveDate)) {
    progress.studyStreak += 1;
    progress.totalStudySessions += 1;
  } else {
    // Missed a day (or more) — streak resets
    progress.studyStreak = 1;
    progress.totalStudySessions += 1;
  }

  progress.lastActiveDate = now;

  progress.activityHistory.push({ type, detail, date: now });
  // Keep the log bounded so the document doesn't grow unbounded
  if (progress.activityHistory.length > 30) {
    progress.activityHistory = progress.activityHistory.slice(-30);
  }

  await progress.save();
}

module.exports = { recordActivity };