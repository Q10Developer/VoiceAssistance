import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import VoiceInterface from "@/components/VoiceInterface";
import ConfigPanel from "@/components/ConfigPanel";
import VoiceSettings from "@/components/VoiceSettings";
import HelpCard from "@/components/HelpCard";
import ConnectionStatus from "@/components/ConnectionStatus";
import { ConnectionStatus as ConnectionStatusEnum, ConversationItem, FrappeCredentials, VoiceSettingsType } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Temp user ID for development
const TEMP_USER_ID = 1;

function Home() {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusEnum>(ConnectionStatusEnum.DISCONNECTED);
  const [credentials, setCredentials] = useState<FrappeCredentials>({
    apiUrl: "",
    apiKey: "",
    apiSecret: ""
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    voice: "en-US-female",
    speechRate: 1,
    autoListen: false,
    soundEffects: true
  });
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  // Load configuration if available
  const { data: configData } = useQuery({ 
    queryKey: [`/api/configuration/${TEMP_USER_ID}`],
    retry: false,
    onError: () => {
      // It's okay if this fails on first load
    }
  });

  // Load voice settings if available
  const { data: settingsData } = useQuery({ 
    queryKey: [`/api/voice-settings/${TEMP_USER_ID}`],
    retry: false,
    onError: () => {
      // It's okay if this fails on first load
    }
  });

  // Load conversation history
  const { data: conversationData, refetch: refetchConversations } = useQuery({ 
    queryKey: [`/api/conversations/${TEMP_USER_ID}`],
    retry: false,
    onError: () => {
      // It's okay if this fails on first load
    }
  });

  // Save configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (data: FrappeCredentials) => {
      const response = await apiRequest("POST", "/api/configuration", {
        userId: TEMP_USER_ID,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration saved",
        description: "Successfully connected to Frappe CRM",
      });
      setConnectionStatus(ConnectionStatusEnum.CONNECTED);
    },
    onError: (error) => {
      toast({
        title: "Configuration error",
        description: error.message || "Failed to connect to Frappe CRM",
        variant: "destructive",
      });
      setConnectionStatus(ConnectionStatusEnum.DISCONNECTED);
    }
  });

  // Save voice settings mutation
  const saveVoiceSettingsMutation = useMutation({
    mutationFn: async (data: VoiceSettingsType) => {
      const response = await apiRequest("POST", "/api/voice-settings", {
        userId: TEMP_USER_ID,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Voice settings saved",
        description: "Your voice preferences have been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Settings error",
        description: error.message || "Failed to save voice settings",
        variant: "destructive",
      });
    }
  });

  // Clear conversations mutation
  const clearConversationsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/conversations/${TEMP_USER_ID}`);
    },
    onSuccess: () => {
      setConversations([]);
      toast({
        title: "Conversations cleared",
        description: "Your conversation history has been cleared",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear conversations",
        variant: "destructive",
      });
    }
  });

  // Process query mutation
  const processQueryMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/process-query", {
        userId: TEMP_USER_ID,
        query,
        ...credentials
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add the new conversation items
      const userItem: ConversationItem = {
        role: "user",
        content: data.conversation.query,
        timestamp: new Date(),
      };

      const assistantItem: ConversationItem = {
        role: "assistant",
        content: data.conversation.response,
        timestamp: new Date(),
        additionalContent: data.conversation.metadata
      };

      setConversations(prev => [...prev, userItem, assistantItem]);
      refetchConversations();
    },
    onError: (error) => {
      toast({
        title: "Processing error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    }
  });

  // Initialize data from server if available
  useEffect(() => {
    if (configData) {
      setCredentials({
        apiUrl: configData.apiUrl,
        apiKey: configData.apiKey,
        apiSecret: configData.apiSecret
      });
      setConnectionStatus(ConnectionStatusEnum.CONNECTED);
    }

    if (settingsData) {
      setVoiceSettings({
        voice: settingsData.voice,
        speechRate: settingsData.speechRate,
        autoListen: settingsData.autoListen,
        soundEffects: settingsData.soundEffects
      });
    }

    if (conversationData) {
      const formattedConversations: ConversationItem[] = [];
      
      conversationData.forEach((conv: any) => {
        formattedConversations.push({
          role: "user",
          content: conv.query,
          timestamp: new Date(conv.timestamp),
        });
        
        formattedConversations.push({
          role: "assistant",
          content: conv.response,
          timestamp: new Date(conv.timestamp),
          additionalContent: conv.metadata
        });
      });
      
      setConversations(formattedConversations);
    }
  }, [configData, settingsData, conversationData]);

  // Handle saving configuration
  const handleSaveConfig = (data: FrappeCredentials) => {
    setConnectionStatus(ConnectionStatusEnum.CONNECTING);
    setCredentials(data);
    saveConfigMutation.mutate(data);
  };

  // Handle saving voice settings
  const handleSaveVoiceSettings = (data: VoiceSettingsType) => {
    setVoiceSettings(data);
    saveVoiceSettingsMutation.mutate(data);
  };

  // Handle clearing conversations
  const handleClearConversations = () => {
    clearConversationsMutation.mutate();
  };

  // Handle processing voice queries
  const handleProcessQuery = (query: string) => {
    if (connectionStatus !== ConnectionStatusEnum.CONNECTED) {
      toast({
        title: "Not connected",
        description: "Please connect to Frappe CRM first",
        variant: "destructive",
      });
      return;
    }

    processQueryMutation.mutate(query);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Frappe CRM Voice Assistant</h1>
              <p className="text-gray-600 mt-1">Voice-powered CRM interactions</p>
            </div>
            
            <ConnectionStatus status={connectionStatus} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Voice Interface */}
          <div className="lg:col-span-2">
            <VoiceInterface
              voiceSettings={voiceSettings}
              conversations={conversations}
              onProcessQuery={handleProcessQuery}
              onClearConversations={handleClearConversations}
              isProcessing={processQueryMutation.isPending}
            />
          </div>
          
          {/* Configuration and Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <ConfigPanel 
              initialValues={credentials}
              onSave={handleSaveConfig}
              isPending={saveConfigMutation.isPending}
              connectionStatus={connectionStatus}
            />
            
            <VoiceSettings
              initialValues={voiceSettings}
              onSave={handleSaveVoiceSettings}
              isPending={saveVoiceSettingsMutation.isPending}
            />
            
            <HelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
