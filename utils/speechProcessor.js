export const questionPatterns = [
  /^what/i, /^when/i, /^where/i, /^who/i, /^why/i, /^which/i, /^how/i,
  /^do/i, /^does/i, /^did/i, /^can/i, /^could/i, /^will/i, /^would/i,
  /^shall/i, /^should/i, /^is/i, /^are/i, /^was/i, /^were/i,
  /can you tell me/i, /do you know/i, /i wonder if/i
];

export function isQuestion(text) {
  return questionPatterns.some((pattern) => pattern.test(text));
}

export function processSpeech(text) {
  if (isQuestion(text)) {
    // Send the detected question to the background script
    chrome.runtime.sendMessage({ type: 'questionDetected', question: text });
  }
}
