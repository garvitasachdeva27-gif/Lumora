const LearningProfile = require('../models/LearningProfile');

// Applies the background analyzer's findings to the user's LearningProfile.
async function applyAnalysis(userId, analysis) {
  if (!analysis || typeof analysis !== 'object' || Object.keys(analysis).length === 0) return;

  const setFields = {};
  if (analysis.preferredLanguage) setFields.preferredLanguage = analysis.preferredLanguage;
  if (analysis.learningPace) setFields.learningPace = analysis.learningPace;

  const addToSetFields = {};
  if (Array.isArray(analysis.preferredStyle) && analysis.preferredStyle.length) {
    addToSetFields.preferredStyle = { $each: analysis.preferredStyle };
  }
  if (Array.isArray(analysis.weakTopics) && analysis.weakTopics.length) {
    addToSetFields.weakTopics = { $each: analysis.weakTopics };
  }
  if (analysis.recentTopic) addToSetFields.recentTopics = analysis.recentTopic;
  if (analysis.insight) addToSetFields.aiInsights = analysis.insight;

  const update = {};
  if (Object.keys(setFields).length) update.$set = setFields;
  if (Object.keys(addToSetFields).length) update.$addToSet = addToSetFields;
  if (Object.keys(update).length === 0) return;

  await LearningProfile.findOneAndUpdate({ userId }, update);
}

module.exports = { applyAnalysis };