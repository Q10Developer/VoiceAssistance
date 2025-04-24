import { useState, useEffect, useRef } from "react";
import { ConversationItem } from "@/types";
import { MessageCircle, Bot } from "lucide-react";
import { format } from "date-fns";

interface ConversationHistoryProps {
  conversations: ConversationItem[];
}

const ConversationHistory = ({ conversations }: ConversationHistoryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [conversations]);

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return format(date, "p"); // e.g., "12:00 PM"
  };

  return (
    <div className="p-6">
      <h3 className="text-md font-medium text-gray-700 mb-4">Conversation History</h3>
      
      {conversations.length > 0 ? (
        <div ref={containerRef} className="space-y-4 max-h-96 overflow-y-auto">
          {conversations.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${item.role === 'assistant' ? 'bg-primary' : 'bg-gray-200'} flex items-center justify-center`}>
                {item.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-white" />
                ) : (
                  <MessageCircle className="h-4 w-4 text-gray-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">
                    {item.role === 'assistant' ? 'Assistant' : 'You'}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-1">{item.content}</p>
                
                {/* Display additional content if available */}
                {item.role === 'assistant' && item.additionalContent && item.additionalContent.data && (
                  <div className="mt-2 bg-gray-50 rounded p-3 text-sm">
                    {Array.isArray(item.additionalContent.data) ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {item.additionalContent.data.map((dataItem: any, i: number) => (
                          <li key={i}>{dataItem}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{JSON.stringify(item.additionalContent.data)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="text-gray-400 mb-2">
            <MessageCircle className="mx-auto h-8 w-8" />
          </div>
          <p className="text-gray-500">No conversation history yet. Start speaking to the assistant.</p>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
