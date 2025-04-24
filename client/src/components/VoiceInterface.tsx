import { useState, useEffect, useRef } from "react";
import ConversationHistory from "./ConversationHistory";
import VoiceVisualization from "./VoiceVisualization";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import { ConversationItem, VoiceSettingsType } from "@/types";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface VoiceInterfaceProps {
  voiceSettings: VoiceSettingsType;
  conversations: ConversationItem[];
  onProcessQuery: (query: string) => void;
  onClearConversations: () => void;
  isProcessing: boolean;
}

const VoiceInterface = ({
  voiceSettings,
  conversations,
  onProcessQuery,
  onClearConversations,
  isProcessing
}: VoiceInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Click the microphone to speak");
  
  // Voice recognition hooks
  const { 
    startListening, 
    stopListening, 
    transcript, 
    resetTranscript, 
    isListening,
    hasRecognitionSupport 
  } = useSpeechRecognition();
  
  // Text-to-speech hook
  const { speak } = useSpeechSynthesis();
  
  // Reference to the last assistant message
  const lastAssistantMessageRef = useRef<string | null>(null);

  // Start or stop recording
  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
      setStatusMessage("Processing...");
    } else {
      resetTranscript();
      startListening();
      setStatusMessage("Listening...");
    }
    setIsRecording(!isRecording);
  };

  // Clear conversations
  const handleClearConversations = () => {
    onClearConversations();
  };

  // Process transcript when recording stops
  useEffect(() => {
    if (!isListening && transcript && transcript.trim() !== "" && !isProcessing) {
      // Process the transcript
      onProcessQuery(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, isProcessing]);

  // Update status message based on state
  useEffect(() => {
    if (isProcessing) {
      setStatusMessage("Processing...");
    } else if (isRecording) {
      setStatusMessage("Listening...");
    } else {
      setStatusMessage("Click the microphone to speak");
    }
  }, [isRecording, isProcessing]);

  // Play assistant responses using TTS
  useEffect(() => {
    if (conversations.length > 0) {
      const lastMessage = conversations[conversations.length - 1];
      
      // Only speak if it's an assistant message and it's new
      if (lastMessage.role === "assistant" && lastMessage.content !== lastAssistantMessageRef.current) {
        lastAssistantMessageRef.current = lastMessage.content;
        
        if (voiceSettings.soundEffects) {
          // Use TTS to speak the response
          speak(lastMessage.content, {
            voice: voiceSettings.voice,
            rate: voiceSettings.speechRate
          });
        }
      }
    }
  }, [conversations, voiceSettings]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Voice Assistant</h2>
        </div>
        
        {/* Voice Visualization */}
        <VoiceVisualization 
          isRecording={isRecording} 
          isProcessing={isProcessing} 
        />
        
        {/* Status Text */}
        <div className="text-center mb-8">
          <p className={`text-sm font-medium ${isRecording ? "text-primary" : "text-gray-600"}`}>
            {statusMessage}
          </p>
          {!hasRecognitionSupport && (
            <p className="text-xs text-red-500 mt-1">
              Speech recognition is not supported in your browser. Please try Chrome or Edge.
            </p>
          )}
        </div>
        
        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={toggleRecording}
              disabled={isProcessing || !hasRecognitionSupport}
              className="bg-primary hover:bg-primary/90"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={toggleRecording}
              variant="secondary"
              disabled={isProcessing}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
          
          <Button
            onClick={handleClearConversations}
            variant="secondary"
            disabled={isProcessing || conversations.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
      
      {/* Conversation History */}
      <div className="border-t border-gray-200">
        <ConversationHistory conversations={conversations} />
      </div>
    </div>
  );
};

export default VoiceInterface;
