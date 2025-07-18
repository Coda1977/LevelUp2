import { X } from "lucide-react";
import { useState } from "react";

interface ToolModalProps {
  tool: {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add the user's input to responses
    setResponses(prev => [...prev, inputValue.trim()]);
    setInputValue("");

    // For 5 Whys, guide the user through the process
    if (tool.title === "5 Whys" && responses.length < 5) {
      const nextQuestion = `Why did "${inputValue.trim()}" happen?`;
      setTimeout(() => {
        setResponses(prev => [...prev, `🤔 ${nextQuestion}`]);
      }, 500);
    }
  };

  const renderToolContent = () => {
    switch (tool.title) {
      case "5 Whys":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">How to use 5 Whys:</h4>
              <p className="text-blue-800 text-sm">
                Start by describing the problem, then ask "Why?" five times to get to the root cause.
              </p>
            </div>
            
            {responses.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>Start by describing the problem you want to analyze.</p>
              </div>
            )}

            <div className="space-y-4 max-h-60 overflow-y-auto">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    response.startsWith("🤔") 
                      ? "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400" 
                      : "bg-gray-50 text-gray-800"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {response.startsWith("🤔") ? "System" : `Step ${Math.ceil((index + 1) / 2)}`}:
                  </span>
                  <p className="mt-1">{response}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={responses.length === 0 ? "Describe the problem..." : "Enter your answer..."}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>

            {responses.length > 0 && (
              <button
                onClick={() => setResponses([])}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        );

      case "Meeting Summary":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Meeting Summary Tool</h4>
              <p className="text-green-800 text-sm">
                Paste your meeting notes below and get an AI-powered summary with action items.
              </p>
            </div>
            <textarea
              placeholder="Paste your meeting notes here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Generate Summary
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{tool.icon}</div>
            <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
            <p className="text-gray-600 mb-6">{tool.description}</p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                This tool is coming soon! We're working on bringing you powerful AI-assisted management tools.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{tool.title}</h2>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {tool.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {renderToolContent()}
        </div>
      </div>
    </div>
  );
}