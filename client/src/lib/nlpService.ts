import { apiRequest } from "./queryClient";
import { FrappeCredentials, NlpResponse } from "@/types";

// Simple NLP service for processing voice commands
export class NlpService {
  private userId: number;
  private credentials: FrappeCredentials;

  constructor(userId: number, credentials: FrappeCredentials) {
    this.userId = userId;
    this.credentials = credentials;
  }

  // Update credentials
  updateCredentials(credentials: FrappeCredentials) {
    this.credentials = credentials;
  }

  // Update user ID
  updateUserId(userId: number) {
    this.userId = userId;
  }

  // Process a natural language query
  async processQuery(query: string): Promise<NlpResponse> {
    try {
      const response = await apiRequest("POST", "/api/process-query", {
        userId: this.userId,
        query,
        apiUrl: this.credentials.apiUrl,
        apiKey: this.credentials.apiKey,
        apiSecret: this.credentials.apiSecret
      });
      
      const data = await response.json();
      
      // Create a structured NLP response
      const nlpResponse: NlpResponse = {
        intent: data.intent || "unknown",
        response: data.conversation.response,
        confidence: data.confidence || 0.7, // Mock confidence score
      };
      
      // If there's additional data in the response, include it
      if (data.data) {
        nlpResponse.data = data.data;
      }
      
      return nlpResponse;
    } catch (error) {
      console.error('NLP processing error:', error);
      
      // Return a fallback response
      return {
        intent: "error",
        response: "Sorry, I encountered an error processing your request. Please try again.",
        confidence: 0
      };
    }
  }
}

// Create and export singleton instance
export const nlpService = new NlpService(1, {
  apiUrl: '',
  apiKey: '',
  apiSecret: ''
});
