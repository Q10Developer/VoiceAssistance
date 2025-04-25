# Voice Assistant for Frappe CRM - Project Requirements

This document outlines the dependencies and requirements for the Frappe CRM Voice Assistant project.

## Core Dependencies

### Server-side
- **Node.js**: v20.x
- **Express**: ^4.18.2
- **TypeScript**: ^5.2.2
- **OpenAI API**: ^4.20.1 (for natural language processing)
- **Axios**: ^1.5.0 (for HTTP requests)

### Frontend
- **React**: ^18.2.0
- **React DOM**: ^18.2.0
- **Vite**: ^4.4.9 (for development server)
- **TailwindCSS**: ^3.3.3 (for styling)
- **shadcn/ui**: (for UI components)
- **React Hook Form**: ^7.46.1 (for form handling)
- **Zod**: ^3.22.2 (for validation)
- **Wouter**: ^2.11.0 (for routing)
- **TanStack Query**: ^5.0.0 (for data fetching)
- **Lucide React**: ^0.279.0 (for icons)

### Database & ORM
- **Drizzle ORM**: ^0.28.6
- **Drizzle Kit**: ^0.19.13
- **Drizzle Zod**: ^0.5.0 (for schema validation)

## Browser APIs

The project relies on the following browser APIs:
- **Web Speech API**: For speech recognition and synthesis
  - `SpeechRecognition`
  - `SpeechSynthesis`

## External Services

- **Frappe CRM**: The application connects to a Frappe CRM instance via its API
- **OpenAI**: Used for natural language processing of voice commands

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: For OpenAI integration

## Installation

The project uses npm for package management. All dependencies are listed in the project's `package.json` file and can be installed using:

```bash
npm install
```

## Running the Project

To start the development server:

```bash
npm run dev
```

## Voice Agent Features

1. **Speech Recognition**: Converts spoken commands to text
2. **Natural Language Processing**: Analyzes commands using OpenAI
3. **CRM Integration**: Connects to Frappe CRM for data retrieval and operations
4. **Speech Synthesis**: Responds verbally to user commands
5. **Conversation Memory**: Maintains context and history of interactions

## Supported Commands

The voice agent can understand commands related to:
- Viewing and managing leads
- Creating and assigning tasks
- Checking opportunity and deal status
- Scheduling meetings
- Retrieving customer information