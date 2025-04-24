import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightCircle } from "lucide-react";

const HelpCard = () => {
  const exampleCommands = [
    "Show me all leads from last month",
    "Create a new task to follow up with ABC Company",
    "What's the status of the deal with TechCorp?",
    "Schedule a meeting with John from Acme Inc.",
    "Summarize the open opportunities this quarter"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Example Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {exampleCommands.map((command, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-primary mr-2">
                <ArrowRightCircle className="h-4 w-4" />
              </span>
              <span className="text-gray-600">"{command}"</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default HelpCard;
