import OpenAI from "openai";

// Define Frappe credentials interface
interface FrappeCredentials {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types for the OpenAI service
interface ProcessVoiceQueryOptions {
  query: string;
  credentials: FrappeCredentials;
}

interface ProcessVoiceQueryResponse {
  intent: string;
  response: string;
  confidence: number;
  metadata?: any;
  action?: {
    type: string;
    parameters?: Record<string, any>;
  };
}

/**
 * OpenAI integration service for processing voice commands
 */
export class OpenAIService {
  
  /**
   * Process a natural language voice query using OpenAI
   */
  async processVoiceQuery({ query, credentials }: ProcessVoiceQueryOptions): Promise<ProcessVoiceQueryResponse> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }
    
    try {
      // Format the system prompt with contextual information
      const systemPrompt = this.getSystemPrompt(credentials);
      
      // Create a chat completion with GPT-4o
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: systemPrompt
          },
          { 
            role: "user", 
            content: query 
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      
      // Parse the response content
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response content from OpenAI");
      }
      
      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(content) as ProcessVoiceQueryResponse;
        
        // Ensure required fields are present
        return {
          intent: parsedResponse.intent || "unknown",
          response: parsedResponse.response || "I'm sorry, I couldn't process that request.",
          confidence: parsedResponse.confidence || 0.5,
          metadata: parsedResponse.metadata,
          action: parsedResponse.action,
        };
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        return {
          intent: "error",
          response: "I'm sorry, I had trouble processing your request. Please try again.",
          confidence: 0.0,
        };
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  }
  
  /**
   * Generate a system prompt for the OpenAI model
   */
  private getSystemPrompt(credentials: FrappeCredentials): string {
    return `
You are an AI voice assistant for Frappe CRM. Your primary role is to help users interact with their Frappe CRM system using natural language voice commands.

You have access to a Frappe CRM instance at: ${credentials.apiUrl || "[URL not configured]"}

When responding to queries:
1. Analyze the user's intent
2. Format your response in a conversational, helpful manner
3. Keep responses concise and focused on CRM-related information
4. If you need to fetch or modify data in the CRM, indicate that clearly

Respond with a valid JSON object that contains the following fields:
- intent: A string representing the detected user intent (e.g., "get_leads", "create_task", "search_contacts")
- response: Your conversational response to the user's query
- confidence: A number between 0 and 1 indicating your confidence in understanding the intent
- metadata: (optional) Any additional information or context about the response
- action: (optional) An object containing:
  - type: The action to perform (e.g., "fetch_data", "create_entity")
  - parameters: Parameters required for the action

Example response format:
{
  "intent": "get_leads",
  "response": "I found 5 leads created in the last month. The most recent is from ABC Company.",
  "confidence": 0.92,
  "metadata": {
    "lead_count": 5,
    "time_period": "last_month"
  },
  "action": {
    "type": "fetch_data",
    "parameters": {
      "doctype": "Lead",
      "filters": [["creation", ">", "2023-05-01"]]
    }
  }
}
`;
  }
}

// Create and export singleton instance
export const openaiService = new OpenAIService();