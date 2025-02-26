// chat.js

// Add animated background class for subtle animation
document.body.classList.add('animated-bg');

// Append a message (question or answer) to the chat log
function addMessage(text, type) {
  const chatLog = document.getElementById('chat-log');
  const messageDiv = document.createElement('div');
  
  // Add classes and text content
  messageDiv.classList.add('message', type);
  messageDiv.textContent = text;
  
  // Add timestamp to messages
  const timestamp = document.createElement('small');
  timestamp.style.display = 'block';
  timestamp.style.marginTop = '8px';
  timestamp.style.color = '#95a5a6';
  timestamp.style.fontSize = '0.75rem';
  timestamp.style.textAlign = 'right';
  
  const now = new Date();
  timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.appendChild(timestamp);
  
  // Add to chat log with smooth scroll
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
  
  // Add typing sound effect for answer messages
  if (type === 'answer') {
    playMessageSound();
  }
}

// Function to play message sound (subtle)
function playMessageSound() {
  // This can be implemented if you want sound effects
  // const audio = new Audio('message-sound.mp3');
  // audio.volume = 0.2;
  // audio.play();
}

// Show welcome message when the chat opens
function showWelcomeMessage() {
  setTimeout(() => {
    addMessage("Welcome to AI Answer Chat! I'll capture questions from your meetings and provide answers automatically.", 'answer');
  }, 500);
}

// Initialize chat
showWelcomeMessage();

// Listen for messages from the background service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'newQA') {
    // Add a slight delay between question and answer for better UX
    addMessage(message.question, 'question');
    
    // Show typing indicator before showing the answer
    showTypingIndicator();
    
    setTimeout(() => {
      // Remove typing indicator
      removeTypingIndicator();
      
      // Show the answer
      addMessage(message.answer, 'answer');
    }, 1200);
  }
});

// Add typing indicator to show AI is thinking
function showTypingIndicator() {
  const chatLog = document.getElementById('chat-log');
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.style.padding = '10px';
  typingDiv.style.marginLeft = '40px';
  typingDiv.style.marginBottom = '10px';
  
  // Create typing animation dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    dot.style.display = 'inline-block';
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.margin = '0 2px';
    dot.style.backgroundColor = '#f8f8f8';
    dot.style.borderRadius = '50%';
    dot.style.opacity = '0.7';
    dot.style.animation = `typingAnimation 1s infinite ${i * 0.3}s`;
    typingDiv.appendChild(dot);
  }
  
  // Add keyframe animation to head
  if (!document.getElementById('typing-animation-style')) {
    const style = document.createElement('style');
    style.id = 'typing-animation-style';
    style.textContent = `
      @keyframes typingAnimation {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  chatLog.appendChild(typingDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}