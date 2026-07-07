// Builds the 4-layer prompt described in the PRD:
// 1. System Prompt  2. Learning Profile  3. Conversation Context  4. User Query

const SYSTEM_PROMPT = `You are Lumora, an adaptive AI teacher. Your goal is to help the student truly understand concepts, not just get answers.

Rules:
- Prioritize conceptual understanding over giving direct answers.
- Adjust your explanation style based on the learner profile provided.
- Be encouraging, patient, and accurate.
- Never invent facts or hallucinate information.
- Keep responses focused and not unnecessarily long.`;

// Maps the frontend's 9 action buttons (PRD "AI Response Actions") to instructions.
// Keys must match the data-action values used in learn.html / chat.js exactly.
function getActionInstruction(action, profile) {
  const instructions = {
    explainDifferently: 'Explain the same concept again, but using a completely different teaching method than before.',
    moreDepth: 'Expand on your previous explanation with more depth and additional detail.',
    simpler: 'Re-explain this using simpler, beginner-friendly language.',
    examples: 'Re-explain this by giving several concrete, practical examples.',
    stepByStep: 'Break this down into clear, numbered steps.',
    visual: 'Explain this with a strong visual/spatial description — use structured text or a simple text-based diagram, since no images can be rendered.',
    quizMe: 'Generate 5 conceptual questions (with answers provided separately below them) to test understanding of the current topic.',
    analogy: 'Teach this using a practical, real-world analogy.',
    translate: `Translate your previous response into ${profile?.preferredLanguage && profile.preferredLanguage !== 'English' ? profile.preferredLanguage : 'Hindi'}, keeping the meaning and technical accuracy intact.`,
  };
  return instructions[action] || '';
}

function buildProfileContext(profile) {
  if (!profile) return 'No learner profile available yet — this is a new student.';

  return `Learner Profile:
- Preferred language: ${profile.preferredLanguage || 'English'}
- Preferred explanation styles: ${profile.preferredStyle?.length ? profile.preferredStyle.join(', ') : 'not yet known'}
- Learning pace: ${profile.learningPace || 'Balanced'}
- Current goal: ${profile.currentGoal || 'not set'}
- Weak topics: ${profile.weakTopics?.length ? profile.weakTopics.join(', ') : 'none identified yet'}
- Recently studied: ${profile.recentTopics?.length ? profile.recentTopics.slice(-3).join(', ') : 'nothing yet'}

Use this to adapt HOW you teach, never to change WHAT is factually correct.`;
}

function buildChatMessages({ profile, recentMessages = [], userQuery, action }) {
  const messages = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\n${buildProfileContext(profile)}` },
  ];

  recentMessages.forEach((m) => {
    messages.push({ role: m.role, content: m.content });
  });

  const modifier = action ? `\n\n(${getActionInstruction(action, profile)})` : '';
  messages.push({ role: 'user', content: `${userQuery}${modifier}` });

  return messages;
}

module.exports = { buildChatMessages };