import { fetchAnswer } from './utils/geminiAPI.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'questionDetected') {
    const question = message.question;
    console.log("Background received question:", question);
    
    fetchAnswer(question)
      .then(answer => {
        // Send the QA pair to the popup/chat interface
        chrome.runtime.sendMessage({ type: 'newQA', question, answer }, response => {
          if (chrome.runtime.lastError) {
            console.warn("No active listener for message:", chrome.runtime.lastError.message);
          }
        });
      })
      .catch(error => {
        console.error("Error fetching answer:", error);
        chrome.runtime.sendMessage({ type: 'newQA', question, answer: "Sorry, an error occurred." }, response => {
          if (chrome.runtime.lastError) {
            console.warn("No active listener for message:", chrome.runtime.lastError.message);
          }
        });
      });
  }
});
