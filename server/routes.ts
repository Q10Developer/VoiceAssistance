import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertConfigSchema, 
  insertVoiceSettingsSchema, 
  insertConversationSchema 
} from "@shared/schema";
import axios from "axios";
import { openaiService } from "./openaiService";

// Helper for validating request body
function validateBody<T>(schema: z.ZodType<T>, body: any): T {
  return schema.parse(body);
}

// Helper for handling API errors
function handleApiError(res: Response, error: any) {
  console.error("API Error:", error);
  
  if (error.name === "ZodError") {
    return res.status(400).json({ message: "Validation error", details: error.errors });
  }
  
  const status = error.status || error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  
  return res.status(status).json({ message });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configuration endpoints
  app.post("/api/configuration", async (req: Request, res: Response) => {
    try {
      const configData = validateBody(insertConfigSchema, req.body);
      
      // Test Frappe CRM connectivity
      try {
        const response = await axios.get(`${configData.apiUrl}/method/frappe.auth.get_logged_user`, {
          headers: {
            "Authorization": `token ${configData.apiKey}:${configData.apiSecret}`
          }
        });
        
        if (!response.data || response.status !== 200) {
          return res.status(401).json({ message: "Failed to connect to Frappe CRM. Please check your credentials." });
        }
      } catch (error) {
        return res.status(401).json({ message: "Failed to connect to Frappe CRM. Please check your credentials." });
      }
      
      // Check if configuration already exists for this user
      const existingConfig = await storage.getConfiguration(configData.userId);
      
      if (existingConfig) {
        const updatedConfig = await storage.updateConfiguration(existingConfig.id, configData);
        return res.status(200).json(updatedConfig);
      } else {
        const newConfig = await storage.createConfiguration(configData);
        return res.status(201).json(newConfig);
      }
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  app.get("/api/configuration/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const config = await storage.getConfiguration(userId);
      if (!config) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      
      return res.status(200).json(config);
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  // Voice settings endpoints
  app.post("/api/voice-settings", async (req: Request, res: Response) => {
    try {
      const settingsData = validateBody(insertVoiceSettingsSchema, req.body);
      
      // Check if settings already exist for this user
      const existingSettings = await storage.getVoiceSettings(settingsData.userId);
      
      if (existingSettings) {
        const updatedSettings = await storage.updateVoiceSettings(existingSettings.id, settingsData);
        return res.status(200).json(updatedSettings);
      } else {
        const newSettings = await storage.createVoiceSettings(settingsData);
        return res.status(201).json(newSettings);
      }
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  app.get("/api/voice-settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const settings = await storage.getVoiceSettings(userId);
      if (!settings) {
        return res.status(404).json({ message: "Voice settings not found" });
      }
      
      return res.status(200).json(settings);
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  // Conversation history endpoints
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversationData = validateBody(insertConversationSchema, req.body);
      const newConversation = await storage.createConversation(conversationData);
      return res.status(201).json(newConversation);
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  app.get("/api/conversations/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const conversations = await storage.getConversations(userId, limit);
      
      return res.status(200).json(conversations);
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  app.delete("/api/conversations/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      await storage.clearConversations(userId);
      return res.status(204).send();
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  // Frappe CRM proxy endpoints
  app.post("/api/frappe/query", async (req: Request, res: Response) => {
    try {
      const { apiUrl, apiKey, apiSecret, doctype, filters = [], fields = ["*"], limit = 20 } = req.body;
      
      if (!apiUrl || !apiKey || !apiSecret || !doctype) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      try {
        const response = await axios.get(`${apiUrl}/api/resource/${doctype}`, {
          headers: {
            "Authorization": `token ${apiKey}:${apiSecret}`
          },
          params: {
            filters: JSON.stringify(filters),
            fields: JSON.stringify(fields),
            limit_page_length: limit
          }
        });
        
        return res.status(200).json(response.data);
      } catch (error) {
        if (error.response) {
          return res.status(error.response.status).json(error.response.data);
        }
        throw error;
      }
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  app.post("/api/frappe/execute", async (req: Request, res: Response) => {
    try {
      const { apiUrl, apiKey, apiSecret, method, args = {} } = req.body;
      
      if (!apiUrl || !apiKey || !apiSecret || !method) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      try {
        const response = await axios.post(`${apiUrl}/api/method/${method}`, args, {
          headers: {
            "Authorization": `token ${apiKey}:${apiSecret}`,
            "Content-Type": "application/json"
          }
        });
        
        return res.status(200).json(response.data);
      } catch (error) {
        if (error.response) {
          return res.status(error.response.status).json(error.response.data);
        }
        throw error;
      }
    } catch (error) {
      return handleApiError(res, error);
    }
  });
  
  // Process voice query using OpenAI
  app.post("/api/process-query", async (req: Request, res: Response) => {
    try {
      const { userId, query, apiUrl, apiKey, apiSecret } = req.body;
      
      if (!userId || !query || !apiUrl || !apiKey || !apiSecret) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Check for OpenAI API key
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key not configured" });
      }

      try {
        // Process the query through OpenAI
        const nlpResponse = await openaiService.processVoiceQuery({
          query,
          credentials: { apiUrl, apiKey, apiSecret }
        });
        
        // Store the conversation
        const conversation = await storage.createConversation({
          userId,
          query,
          response: nlpResponse.response,
          intent: nlpResponse.intent,
          metadata: {
            confidence: nlpResponse.confidence,
            ...nlpResponse.metadata,
            action: nlpResponse.action
          }
        });
        
        // Process any actions required based on the intent
        // This could involve fetching data or executing operations in Frappe CRM
        let actionResult = null;
        
        if (nlpResponse.action) {
          // Handle actions based on the action type
          if (nlpResponse.action.type === "fetch_data" && nlpResponse.action.parameters?.doctype) {
            // Example: Fetch data from Frappe CRM
            try {
              const filters = nlpResponse.action.parameters.filters || [];
              const fields = nlpResponse.action.parameters.fields || ["*"];
              const limit = nlpResponse.action.parameters.limit || 20;
              
              const response = await axios.get(`${apiUrl}/api/resource/${nlpResponse.action.parameters.doctype}`, {
                headers: {
                  "Authorization": `token ${apiKey}:${apiSecret}`
                },
                params: {
                  filters: JSON.stringify(filters),
                  fields: JSON.stringify(fields),
                  limit_page_length: limit
                }
              });
              
              actionResult = response.data;
            } catch (actionError: any) {
              console.error("Error executing Frappe CRM action:", actionError);
            }
          }
        }
        
        return res.status(200).json({ 
          conversation, 
          intent: nlpResponse.intent,
          confidence: nlpResponse.confidence,
          actionResult
        });
      } catch (nlpError: any) {
        console.error("NLP processing error:", nlpError);
        
        // Fallback response in case of NLP processing error
        const fallbackResponse = "I'm sorry, I encountered an error processing your request. Please try again.";
        
        // Still create a conversation entry
        const conversation = await storage.createConversation({
          userId,
          query,
          response: fallbackResponse,
          intent: "error",
          metadata: { error: nlpError.message }
        });
        
        return res.status(200).json({ 
          conversation, 
          intent: "error",
          confidence: 0
        });
      }
    } catch (error) {
      return handleApiError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
