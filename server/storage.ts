import {
  users, type User, type InsertUser,
  configurations, type Configuration, type InsertConfiguration,
  voiceSettings, type VoiceSettings, type InsertVoiceSettings,
  conversations, type Conversation, type InsertConversation
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Configuration operations
  getConfiguration(userId: number): Promise<Configuration | undefined>;
  createConfiguration(config: InsertConfiguration): Promise<Configuration>;
  updateConfiguration(id: number, config: Partial<InsertConfiguration>): Promise<Configuration | undefined>;
  
  // Voice settings operations
  getVoiceSettings(userId: number): Promise<VoiceSettings | undefined>;
  createVoiceSettings(settings: InsertVoiceSettings): Promise<VoiceSettings>;
  updateVoiceSettings(id: number, settings: Partial<InsertVoiceSettings>): Promise<VoiceSettings | undefined>;
  
  // Conversation operations
  getConversations(userId: number, limit?: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  clearConversations(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private configurations: Map<number, Configuration>;
  private voiceSettings: Map<number, VoiceSettings>;
  private conversations: Map<number, Conversation>;
  private currentUserId: number;
  private currentConfigId: number;
  private currentVoiceSettingsId: number;
  private currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.configurations = new Map();
    this.voiceSettings = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentConfigId = 1;
    this.currentVoiceSettingsId = 1;
    this.currentConversationId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Configuration operations
  async getConfiguration(userId: number): Promise<Configuration | undefined> {
    return Array.from(this.configurations.values()).find(
      (config) => config.userId === userId
    );
  }

  async createConfiguration(insertConfig: InsertConfiguration): Promise<Configuration> {
    const id = this.currentConfigId++;
    const now = new Date();
    const config: Configuration = { 
      ...insertConfig, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.configurations.set(id, config);
    return config;
  }

  async updateConfiguration(id: number, updateConfig: Partial<InsertConfiguration>): Promise<Configuration | undefined> {
    const config = this.configurations.get(id);
    if (!config) return undefined;
    
    const updatedConfig: Configuration = {
      ...config,
      ...updateConfig,
      updatedAt: new Date()
    };
    
    this.configurations.set(id, updatedConfig);
    return updatedConfig;
  }

  // Voice settings operations
  async getVoiceSettings(userId: number): Promise<VoiceSettings | undefined> {
    return Array.from(this.voiceSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async createVoiceSettings(insertSettings: InsertVoiceSettings): Promise<VoiceSettings> {
    const id = this.currentVoiceSettingsId++;
    const now = new Date();
    const settings: VoiceSettings = { 
      ...insertSettings, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.voiceSettings.set(id, settings);
    return settings;
  }

  async updateVoiceSettings(id: number, updateSettings: Partial<InsertVoiceSettings>): Promise<VoiceSettings | undefined> {
    const settings = this.voiceSettings.get(id);
    if (!settings) return undefined;
    
    const updatedSettings: VoiceSettings = {
      ...settings,
      ...updateSettings,
      updatedAt: new Date()
    };
    
    this.voiceSettings.set(id, updatedSettings);
    return updatedSettings;
  }

  // Conversation operations
  async getConversations(userId: number, limit?: number): Promise<Conversation[]> {
    const userConversations = Array.from(this.conversations.values())
      .filter((conversation) => conversation.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? userConversations.slice(0, limit) : userConversations;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date();
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      timestamp: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async clearConversations(userId: number): Promise<void> {
    for (const [id, conversation] of this.conversations.entries()) {
      if (conversation.userId === userId) {
        this.conversations.delete(id);
      }
    }
  }
}

// Export storage instance
export const storage = new MemStorage();
