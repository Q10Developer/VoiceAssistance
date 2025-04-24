export interface FrappeCredentials {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
}

export interface VoiceSettingsType {
  voice: string;
  speechRate: number;
  autoListen: boolean;
  soundEffects: boolean;
}

export enum ConnectionStatus {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
}

export interface ConversationItem {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  additionalContent?: {
    [key: string]: any;
  };
}

export interface NlpResponse {
  intent: string;
  response: string;
  confidence?: number;
  entities?: any[];
  data?: any;
}
