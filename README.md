# Frappe CRM Voice Assistant

A voice-controlled assistant that integrates with Frappe CRM to enable natural language voice interactions with your CRM system.

![Frappe CRM Voice Assistant](https://via.placeholder.com/800x400?text=Frappe+CRM+Voice+Assistant)

## Overview

This application allows users to interact with their Frappe CRM using voice commands. It leverages modern web speech APIs combined with advanced natural language processing to understand user intent and perform CRM operations.

### Key Features

- **Voice Command Recognition**: Speak naturally to control your CRM
- **OpenAI-Powered NLP**: Sophisticated understanding of CRM-related queries
- **Frappe CRM Integration**: Connect to any Frappe CRM instance
- **Conversational Interface**: Natural dialogue with your CRM system
- **Voice Response**: Hear responses from your CRM read aloud
- **Command History**: Keep track of past interactions

## Setup

### Prerequisites

- Node.js (v16+)
- Frappe CRM instance with API access
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/frappe-crm-voice-assistant.git
cd frappe-crm-voice-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Open the application in a supported browser (Chrome recommended for best speech recognition)
2. Configure your Frappe CRM connection in the settings panel:
   - Enter your Frappe CRM API URL
   - Add your API Key and Secret
3. Click the microphone button and speak your command
4. The assistant will process your request and respond both visually and audibly

### Example Commands

- "Show me all leads from last month"
- "Create a new task to follow up with ABC Company"
- "What's the status of the deal with TechCorp?"
- "Schedule a meeting with John from Acme Inc."
- "Summarize the open opportunities this quarter"

## Architecture

The application consists of:

- **React Frontend**: Modern UI with speech recognition and synthesis
- **Express Backend**: API layer for CRM interactions and NLP processing
- **OpenAI Integration**: Natural language understanding and intent recognition
- **Frappe CRM Connector**: Secure API communication with Frappe

## Technologies

- React + TypeScript
- TanStack Query for data fetching
- Tailwind CSS + shadcn/ui for styling
- Web Speech API for voice interactions
- OpenAI API for natural language processing
- Express for backend services
- Drizzle ORM for data management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Frappe CRM team for their excellent API
- OpenAI for advanced natural language processing capabilities
- Web Speech API for making voice interactions possible in the browser