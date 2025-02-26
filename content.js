// Define the question patterns
const questionPatterns = [
  /^what/i, /^when/i, /^where/i, /^who/i, /^why/i, /^which/i, /^how/i,
  /^do/i, /^does/i, /^did/i, /^can/i, /^could/i, /^will/i, /^would/i,
  /^shall/i, /^should/i, /^is/i, /^are/i, /^was/i, /^were/i,
  /can you tell me/i, /do you know/i, /i wonder if/i
];

// Check if a given text is a question
function isQuestion(text) {
  return questionPatterns.some((pattern) => pattern.test(text));
}

// Process speech transcript and send detected questions to the background script
function processSpeech(text) {
  console.log("Transcribed:", text);
  if (isQuestion(text)) {
    console.log("Question detected:", text);
    chrome.runtime.sendMessage({ type: 'questionDetected', question: text });
  }
}

// Check for Speech Recognition API support
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript.trim();
        processSpeech(transcript);
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error, event);
    if (event.error === 'no-speech') {
      console.warn("No speech detected. Check your microphone or ensure you're speaking clearly.");
      // Optionally, restart recognition after a delay
      setTimeout(() => {
        recognition.start();
        console.log("Speech recognition restarted after no-speech error.");
      }, 2000);
    } else if (event.error === 'not-allowed') {
      console.error("Permission to use speech recognition was denied. Please grant microphone access.");
    }
  };

  // Create a start button for user-initiated speech recognition
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Speech Recognition';
  // Style the button
  startButton.style.position = 'fixed';
  startButton.style.bottom = '20px';
  startButton.style.right = '20px';
  startButton.style.padding = '10px 15px';
  startButton.style.backgroundColor = '#007BFF';
  startButton.style.color = '#fff';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '5px';
  startButton.style.cursor = 'pointer';
  startButton.style.zIndex = 10000;
  document.body.appendChild(startButton);

  startButton.addEventListener('click', () => {
    recognition.start();
    console.log("Speech recognition started.");
    // Optionally hide the button after starting recognition
    startButton.style.display = 'none';
  });
} else {
  console.error("Speech Recognition API not supported in this browser.");
}
