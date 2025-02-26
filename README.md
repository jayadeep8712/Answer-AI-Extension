# AI Answer Chrome Extension

## Overview

**AI Answer** is a Chrome extension that captures audio from online meetings (such as Google Meet or team meetings) and processes the conversation in real time. Using speech recognition, it detects questions from either side of the conversation and sends them to the API for answers. The conversation—both the questions and the corresponding responses—is displayed in a user-friendly chat interface.

## Features

- **Audio Capture:** Uses the `tabCapture` API to capture audio from the meeting tab.
- **Speech Recognition:** Converts spoken words into text using the Web Speech API.
- **Question Detection:** Uses a set of regular expression patterns to identify questions in the transcribed text.
- **API Integration:** Sends detected questions to the API from Google AI Studio (with your API key configured in `config.js`) and retrieves answers.
- **Chat Interface:** Displays a running log of questions and answers in a dedicated `chat.html` page.



