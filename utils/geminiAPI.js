import { API_KEY } from '../config.js';

async function fetchAnswer(question) {
  // Use the v1beta endpoint for Gemini 2.0 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Build the payload using the "contents" field
  const payload = {
    contents: [
      {
        parts: [
          { text: question }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API responded with an error:", response.status, response.statusText, errorText);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log("Gemini API full response:", data);

    // Try to extract the answer from different possible fields
    let answer = "Sorry, I couldn't fetch an answer.";
    if (data.candidates && data.candidates.length > 0) {
      // Option 1: Check for output.text (as per some documentation)
      if (data.candidates[0].output && data.candidates[0].output.text) {
        answer = data.candidates[0].output.text;
      }
      // Option 2: Direct candidate text
      else if (data.candidates[0].text) {
        answer = data.candidates[0].text;
      }
      // Option 3: If the API uses a different key (e.g. generatedText)
      else if (data.generatedText) {
        answer = data.generatedText;
      }
    }
    return answer;
  } catch (error) {
    console.error("Error fetching answer:", error);
    return "Sorry, I couldn't fetch an answer.";
  }
}

export { fetchAnswer };
