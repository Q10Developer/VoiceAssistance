import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

interface VoiceVisualizationProps {
  isRecording: boolean;
  isProcessing: boolean;
}

const VoiceVisualization = ({ isRecording, isProcessing }: VoiceVisualizationProps) => {
  // Create audio visualization
  return (
    <div className="flex justify-center my-8">
      <div className="relative flex items-center justify-center h-28 w-28 bg-gray-50 rounded-full border-4 border-primary">
        {/* Visualization Elements - Only visible during recording */}
        {isRecording && (
          <div className="flex items-end justify-center space-x-1 h-16 w-full">
            <div className="wave h-4 w-1 bg-primary rounded-full" style={{animationDelay: "0s"}}></div>
            <div className="wave h-12 w-1 bg-primary rounded-full" style={{animationDelay: "0.2s"}}></div>
            <div className="wave h-8 w-1 bg-primary rounded-full" style={{animationDelay: "0.4s"}}></div>
            <div className="wave h-16 w-1 bg-primary rounded-full" style={{animationDelay: "0.6s"}}></div>
            <div className="wave h-10 w-1 bg-primary rounded-full" style={{animationDelay: "0.8s"}}></div>
            <div className="wave h-6 w-1 bg-primary rounded-full" style={{animationDelay: "1s"}}></div>
            <div className="wave h-12 w-1 bg-primary rounded-full" style={{animationDelay: "1.2s"}}></div>
          </div>
        )}
        
        {/* Microphone icon when not recording */}
        {!isRecording && !isProcessing && (
          <div className="text-primary text-4xl">
            <Mic size={40} />
          </div>
        )}
        
        {/* Processing spinner */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceVisualization;

// Add CSS for wave animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .wave {
    animation: wave 1.5s infinite ease-in-out;
  }
  
  @keyframes wave {
    0% { transform: scaleY(0.5); }
    50% { transform: scaleY(1); }
    100% { transform: scaleY(0.5); }
  }
`;
document.head.appendChild(styleSheet);
