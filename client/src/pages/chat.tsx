import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function Chat() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/chat/history"],
    enabled: isAuthenticated,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
      setInputMessage('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendMessage = () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const starterPrompts = [
    {
      title: 'Delegation Help',
      preview: 'I need help delegating tasks to my team effectively'
    },
    {
      title: 'Feedback Practice',
      preview: 'How do I give difficult feedback to a team member?'
    },
    {
      title: 'Meeting Efficiency',
      preview: 'My meetings are unproductive. What can I do?'
    },
    {
      title: 'Team Motivation',
      preview: 'How can I better motivate my team members?'
    }
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent-yellow)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col pb-20 md:pb-0">
      {/* Chat Header */}
      <div className="bg-white p-8 border-b border-gray-200 text-center">
        <h1 className="text-2xl font-bold mb-3">
          AI Mentor Chat
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl mx-auto">
          Get personalized advice and practice management scenarios
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 chat-messages">
        {messages.length === 0 ? (
          /* Welcome State */
          <div className="text-center py-16 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white border-4 border-[var(--text-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-black">∞</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Start a Conversation</h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10">
              Ask me anything about management, leadership, or applying Level Up concepts
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {starterPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left"
                  onClick={() => setInputMessage(prompt.preview)}
                >
                  <h3 className="font-semibold mb-2">{prompt.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">{prompt.preview}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message: Message, index: number) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-base font-bold">
                  {message.role === 'assistant' ? (
                    <div className="w-10 h-10 bg-white border-2 border-[var(--text-primary)] rounded-full flex items-center justify-center">
                      <span className="text-[var(--text-primary)] font-black">∞</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-[var(--accent-yellow)] rounded-full flex items-center justify-center">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-[var(--accent-blue)] text-white' 
                    : 'bg-white shadow-md'
                }`}>
                  <p className="text-base leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-gray-200' : 'text-[var(--text-secondary)]'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-white border-2 border-[var(--text-primary)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--text-primary)] font-black">∞</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-6 border-t border-gray-200">
        <div className="max-w-3xl mx-auto relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about management, leadership, or any Level Up topic..."
            className="w-full pr-16 pl-5 py-4 border-2 border-gray-300 rounded-3xl text-base resize-none focus:outline-none focus:border-[var(--accent-yellow)] focus:ring-4 focus:ring-[var(--accent-yellow)] focus:ring-opacity-20 min-h-[56px] max-h-[120px]"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[var(--accent-blue)] text-white rounded-full flex items-center justify-center hover:bg-[var(--accent-yellow)] hover:text-[var(--text-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
