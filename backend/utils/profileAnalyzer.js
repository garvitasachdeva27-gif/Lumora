// Builds the SECOND prompt — the "Profile Analyzer" from the PRD.
// This runs in the background after the user already has their reply.

function buildAnalysisPrompt(userMessage, aiReply, currentProfile) {
  return [
    {
      role: 'system',
      content: `You are a silent analysis engine for an adaptive learning app. Analyze one exchange between a student and an AI teacher. Return ONLY valid JSON (no markdown, no explanation) with any of these OPTIONAL keys you have evidence for:
{
  "preferredLanguage": "English" | "Hindi" | "Hinglish",
  "preferredStyle": ["Examples", "Step-by-step", "Theory", "Visual", "Analogy"],
  "learningPace": "Slow" | "Balanced" | "Fast",
  "weakTopics": ["topic name"],
  "recentTopic": "topic name",
  "insight": "one short human-readable observation, or omit this key"
}
Omit any key you have no clear evidence for. If there's nothing meaningful to report, return {}.`,
    },
    {
      role: 'user',
      content: `Student's message: "${userMessage}"\n\nAI's reply: "${aiReply}"\n\nStudent's current profile: ${JSON.stringify({
        preferredLanguage: currentProfile?.preferredLanguage,
        preferredStyle: currentProfile?.preferredStyle,
        learningPace: currentProfile?.learningPace,
      })}`,
    },
  ];
}

function parseAnalysis(raw) {
  if (!raw) return null;
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Could not parse analysis JSON:', raw);
    return null;
  }
}

module.exports = { buildAnalysisPrompt, parseAnalysis };