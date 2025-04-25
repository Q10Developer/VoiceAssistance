import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HelpCardProps {
  isExpanded?: boolean;
}

const HelpCard: React.FC<HelpCardProps> = ({ isExpanded = false }) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Voice Commands Guide</CardTitle>
        <CardDescription>Sample commands to try with the voice assistant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">🔍 Query Commands</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>"Show me all open leads"</li>
              <li>"Find opportunities worth more than 20,000 dollars"</li>
              <li>"What tasks are due this week?"</li>
              <li>"Show me leads from the Website source"</li>
              <li>"List qualified leads"</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">➕ Creation Commands</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>"Create a new lead for Jane Smith at Acme Corp"</li>
              <li>"Add a task to follow up with John from TechCorp tomorrow"</li>
              <li>"Create an opportunity for Global Logistics"</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">📊 Summary Commands</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>"Summarize this month's opportunities"</li>
              <li>"How many open leads do we have?"</li>
              <li>"What's the total value of our pipeline?"</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">🔧 Utility Commands</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>"Help me prioritize my tasks"</li>
              <li>"What should I focus on today?"</li>
              <li>"Clear conversation history"</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        <p>
          <strong>Note:</strong> When using simulation mode, you can try any of these commands
          without a real CRM connection. The assistant will respond with simulated data.
        </p>
      </CardFooter>
    </Card>
  );
};

export default HelpCard;