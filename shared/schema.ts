import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (basic auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Configuration schema for storing Frappe CRM credentials
export const configurations = pgTable("configurations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  apiUrl: text("api_url").notNull(),
  apiKey: text("api_key").notNull(),
  apiSecret: text("api_secret").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConfigSchema = createInsertSchema(configurations).pick({
  userId: true,
  apiUrl: true,
  apiKey: true,
  apiSecret: true,
});

// Voice settings schema for storing user preferences
export const voiceSettings = pgTable("voice_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  voice: text("voice").default("en-US-female"),
  speechRate: integer("speech_rate").default(1),
  autoListen: boolean("auto_listen").default(false),
  soundEffects: boolean("sound_effects").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVoiceSettingsSchema = createInsertSchema(voiceSettings).pick({
  userId: true,
  voice: true,
  speechRate: true,
  autoListen: true,
  soundEffects: true,
});

// Conversation history schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  query: text("query").notNull(),
  response: text("response").notNull(),
  intent: text("intent"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  query: true,
  response: true,
  intent: true,
  metadata: true,
});

// Types for schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Configuration = typeof configurations.$inferSelect;
export type InsertConfiguration = z.infer<typeof insertConfigSchema>;

export type VoiceSettings = typeof voiceSettings.$inferSelect;
export type InsertVoiceSettings = z.infer<typeof insertVoiceSettingsSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
