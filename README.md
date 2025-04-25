# Frappe CRM Voice Assistant

A voice-operated assistant that integrates with Frappe CRM to enable voice-controlled CRM operations.

## Features

- 🎙️ **Voice Recognition**: Interact with your CRM using natural voice commands
- 🤖 **NLP Processing**: Advanced natural language processing powered by OpenAI
- 🔄 **Frappe CRM Integration**: Connect to your existing Frappe CRM instance
- 🧪 **Simulation Mode**: Test with simulated data without a real CRM connection
- 💬 **Conversation History**: Review past interactions and responses
- ⚙️ **Customizable Voice Settings**: Adjust voice, speech rate, and other preferences

## Getting Started

### Prerequisites

- Node.js 16+
- OpenAI API key
- (Optional) Frappe CRM instance with API credentials

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Add your OpenAI API key to environment variables
4. Start the development server:
```bash
npm run dev
```

## Using Simulation Mode

For testing without a real Frappe CRM connection, use the simulation mode:

1. In the Configuration panel, enter:
   - API URL: `simulation`
   - API Key: `test`
   - API Secret: `test`

2. Click "Save Configuration"

3. Try voice commands like:
   - "Show me all open leads"
   - "Find opportunities worth more than 20,000 dollars"
   - "What tasks are due this week?"

## Project Structure

- `client/`: React frontend application
  - `src/components/`: React components
  - `src/hooks/`: Custom React hooks
  - `src/pages/`: Application pages
  - `src/lib/`: Utility and service files
  - `src/types/`: TypeScript type definitions
- `server/`: Node.js backend
  - `index.ts`: Main server file
  - `routes.ts`: API endpoints
  - `storage.ts`: Data storage implementation
  - `openaiService.ts`: OpenAI integration
  - `simulationService.ts`: Simulation service for testing
- `shared/`: Shared code between frontend and backend
  - `schema.ts`: Database schema and types

## Voice Commands

The assistant can understand various types of commands:

### Query Commands
- "Show me all open leads"
- "Find opportunities worth more than 20,000 dollars"
- "What tasks are due this week?"

### Creation Commands
- "Create a new lead for Jane Smith at Acme Corp"
- "Add a task to follow up with John from TechCorp tomorrow"

### Summary Commands
- "Summarize this month's opportunities"
- "How many open leads do we have?"

## Technical Details

This project uses:

- React with TypeScript for the frontend
- Express.js for the backend
- OpenAI API for natural language processing
- Web Speech API for voice recognition and synthesis
- TanStack Query for data fetching
- Shadcn UI components with Tailwind CSS for styling

## License

MIT License

## Acknowledgements

- [Frappe](https://frappeframework.com/)
- [OpenAI](https://openai.com/)
- [React](https://reactjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)