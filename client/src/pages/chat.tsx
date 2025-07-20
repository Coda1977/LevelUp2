import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Copy, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from 'react-markdown'; // If not available, install or leave as placeholder

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Placeholder for chat sessions
const mockSessions = [
  { id: '1', name: 'Delegation Dilemma', summary: 'How to delegate more effectively' },
  { id: '2', name: 'Feedback Challenge', summary: 'Giving tough feedback' },
  { id: '3', name: 'Team Motivation', summary: 'How to energize my team' },
];

export default function Chat() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessions, setSessions] = useState(mockSessions); // Replace with API call
  const [selectedSessionId, setSelectedSessionId] = useState(mockSessions[0].id);
  const [chatNameCounter, setChatNameCounter] = useState(4);
  const [isAITyping, setIsAITyping] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetch('/api/chat/sessions')
        .then(res => res.json())
        .then(data => {
          setSessions(data);
          if (data.length > 0 && !data.find((s: any) => s.id === selectedSessionId)) {
            setSelectedSessionId(data[0].id);
          }
        });
    }
  }, [isLoading, isAuthenticated]);

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/chat/history", selectedSessionId],
    queryFn: () => fetch(`/api/chat/history/${selectedSessionId}`).then(res => res.json()),
    enabled: isAuthenticated && !!selectedSessionId,
  });

  // Use messages directly since they're already filtered by session
  const sessionMessages = messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsAITyping(true);
      setChatError(null);
      const response = await apiRequest("POST", "/api/chat", { message, sessionId: selectedSessionId });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history", selectedSessionId] });
      setInputMessage('');
      setIsAITyping(false);
      
      // Auto-generate chat name from first message if current chat has default name
      const currentSession = sessions.find(s => s.id === selectedSessionId);
      if (currentSession && currentSession.name.startsWith('New Chat ')) {
        generateChatName(inputMessage, currentSession.id);
      }
    },
    onError: (error) => {
      setIsAITyping(false);
      setChatError("AI is temporarily unavailable. Please try again.");
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

  const sendMessage = async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;
    setIsAITyping(true);
    setChatError(null);
    setStreamingMessage('');
    
    // Build system prompt (same as in server routes.ts)
    const systemPrompt = `You are the AI Mentor for Level Up, a management development app that transforms leadership learning into bite-sized, actionable insights. Your role is to help managers apply what they learn to real workplace situations with practical, supportive guidance.

## Your Identity

You are a knowledgeable, experienced management coach who is:
- **Supportive but direct** - You provide honest, actionable advice without being preachy
- **Practical-focused** - Every response should help the user take concrete action
- **Framework-oriented** - You use proven management frameworks and reference specific Level Up content
- **Conversational** - Professional but approachable, like talking to a trusted mentor
- **Context-aware** - You remember what users have learned and can connect concepts across chapters

## Response Guidelines

### Structure Your Responses
1. **Lead with practical advice** - Start with what they can do, not theory
2. **Use specific frameworks** - Reference RACI, SBI, Total Motivation factors, etc.
3. **Provide concrete examples** - Give specific scenarios when possible
4. **Include chapter references** - Link to relevant Level Up content
5. **End with a next step** - Always give them something actionable to try

### Tone and Style
- Use **bold text** for key frameworks and important points
- Write in short, scannable paragraphs (2-3 sentences max)
- Ask follow-up questions to understand their specific situation
- Avoid jargon - use simple, clear language
- Be encouraging but realistic about challenges`;

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...sessionMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: inputMessage }
          ],
          systemPrompt,
          sessionId: selectedSessionId,
        }),
      });
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      let aiMessage = '';
      setInputMessage('');
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data:')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') {
              setIsAITyping(false);
              setStreamingMessage(null);
              queryClient.invalidateQueries({ queryKey: ["/api/chat/history", selectedSessionId] });
              return;
            }
            try {
              const { token } = JSON.parse(data);
              if (token) {
                aiMessage += token;
                setStreamingMessage(aiMessage);
              }
            } catch {}
          }
        }
      }
      setIsAITyping(false);
      setStreamingMessage(null);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history", selectedSessionId] });
    } catch (error) {
      setIsAITyping(false);
      setStreamingMessage(null);
      setChatError("AI is temporarily unavailable. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Copy message to clipboard
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard!' });
  };

  // Static follow-up suggestions (replace with AI-generated if desired)
  const followUps = [
    'Can you give me a concrete example?',
    'What framework would you use here?',
    'What should I try next week?'
  ];

  // New chat handler
  const handleNewChat = async () => {
    try {
      // Create session in backend
      const res = await fetch('/api/chat/session', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `New Chat ${chatNameCounter}`,
          summary: ''
        })
      });
      const newSession = await res.json(); // { id, name, summary }
      
      // Refetch sessions from backend
      const sessionRes = await fetch('/api/chat/sessions');
      const sessionList = await sessionRes.json();
      setSessions(sessionList);
      setSelectedSessionId(newSession.id);
      setChatNameCounter(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
    }
  };

  // Delete chat handler
  const handleDeleteChat = async (chatId: string) => {
    if (sessions.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one chat session.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedSessions = sessions.filter(s => s.id !== chatId);
    setSessions(updatedSessions);
    
    // If we deleted the currently selected chat, switch to the first remaining one
    if (selectedSessionId === chatId) {
      setSelectedSessionId(updatedSessions[0].id);
    }
    
    toast({
      title: "Chat deleted",
      description: "Your chat session has been removed.",
    });
    
    // In real code, also delete from backend
    // Refetch sessions from backend
    const sessionRes = await fetch('/api/chat/sessions');
    const sessionList = await sessionRes.json();
    setSessions(sessionList);
    if (!sessionList.find((s: any) => s.id === selectedSessionId) && sessionList.length > 0) {
      setSelectedSessionId(sessionList[0].id);
    }
  };

  // Generate chat name from AI based on user's first message
  const generateChatName = async (firstMessage: string, chatId: string) => {
    try {
      // Simple client-side name generation based on keywords
      const keywords = firstMessage.toLowerCase();
      let generatedName = 'General Discussion';
      
      if (keywords.includes('delegate') || keywords.includes('delegation')) {
        generatedName = 'Delegation Discussion';
      } else if (keywords.includes('feedback') || keywords.includes('review')) {
        generatedName = 'Feedback Conversation';
      } else if (keywords.includes('meeting') || keywords.includes('meetings')) {
        generatedName = 'Meeting Improvement';
      } else if (keywords.includes('team') || keywords.includes('motivation')) {
        generatedName = 'Team Management';
      } else if (keywords.includes('leadership') || keywords.includes('leader')) {
        generatedName = 'Leadership Tips';
      } else if (keywords.includes('communication') || keywords.includes('communicate')) {
        generatedName = 'Communication Skills';
      } else {
        // Take first few words as fallback
        const words = firstMessage.trim().split(' ').slice(0, 3);
        generatedName = words.join(' ').slice(0, 20) + (firstMessage.length > 20 ? '...' : '');
      }
      
      // Update the session name
      setSessions(prev => prev.map(session => 
        session.id === chatId 
          ? { ...session, name: generatedName }
          : session
      ));
    } catch (error) {
      console.error('Failed to generate chat name:', error);
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
    <div className="min-h-screen flex bg-gradient-to-b from-[var(--bg-primary)] to-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white/90 border-r border-gray-200 flex flex-col p-4 gap-4 min-h-screen">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[var(--accent-blue)] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-black">∞</span>
          </div>
          <span className="font-bold text-lg">Your Chats</span>
        </div>
        <button
          className="w-full py-2 bg-[var(--accent-yellow)] text-[var(--text-primary)] rounded-lg font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition"
          onClick={handleNewChat}
        >
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto mt-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`group p-3 rounded-lg mb-2 cursor-pointer transition border relative ${selectedSessionId === session.id ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]' : 'hover:bg-gray-100 border-transparent'}`}
              onClick={() => setSelectedSessionId(session.id)}
            >
              {renamingSessionId === session.id ? (
                <input
                  className="font-semibold truncate pr-8 bg-white text-black border rounded px-2 py-1 w-40"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => {
                    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, name: renameValue } : s));
                    setRenamingSessionId(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, name: renameValue } : s));
                      setRenamingSessionId(null);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div className="flex items-center">
                  <div className="font-semibold truncate pr-2">{session.name}</div>
                  <button
                    className="ml-1 text-xs text-gray-400 hover:text-[var(--accent-yellow)]"
                    onClick={e => {
                      e.stopPropagation();
                      setRenamingSessionId(session.id);
                      setRenameValue(session.name);
                    }}
                    title="Rename session"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              {session.summary && <div className="text-xs opacity-70 truncate">{session.summary}</div>}
              <button
                className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${selectedSessionId === session.id ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:bg-red-100 hover:text-red-600'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(session.id);
                }}
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </aside>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center">
        {/* Header */}
        <div className="w-full max-w-2xl mx-auto px-4 pt-8 pb-4 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[var(--accent-blue)] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-2xl font-black">∞</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Mentor</h1>
          </div>
          <p className="text-[var(--text-secondary)] text-base text-center max-w-xl">
            Get practical, personalized management advice and scenario practice. Your chat is private and always evolving with new content.
          </p>
        </div>

        {/* Chat Container */}
        <div className="w-full max-w-2xl flex-1 flex flex-col bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6" style={{ minHeight: 400 }}>
            {sessionMessages.length === 0 && !streamingMessage ? (
              <div className="text-center py-16 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white border-4 border-[var(--text-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
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
              <div className="flex flex-col gap-6">
                {sessionMessages.map((message: Message, index: number) => (
                  <div
                    key={index}
                    className={`flex gap-3 items-end animate-fade-in ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-base font-bold shadow-md">
                      {message.role === 'assistant' ? (
                        <div className="w-10 h-10 bg-[var(--accent-blue)] border-2 border-[var(--accent-yellow)] rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white font-black">∞</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-[var(--accent-yellow)] rounded-full flex items-center justify-center">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    {/* Message Bubble */}
                    <div className={`relative max-w-[70%] p-4 rounded-2xl shadow-md text-base leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'bg-white border border-gray-100'
                    }`}>
                      {message.role === 'assistant' ? (
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-[var(--text-primary)]" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-semibold mb-1" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[var(--accent-yellow)] pl-4 italic mb-3" {...props} />,
                            code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                            a: ({node, ...props}) => <a className="text-[var(--accent-blue)] hover:underline" {...props} />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <span className="whitespace-pre-wrap">{message.content}</span>
                      )}
                      {/* Copy button */}
                      <button
                        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[var(--accent-blue)] transition"
                        onClick={() => copyMessage(message.content)}
                        title="Copy message"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className={`text-xs mt-2 opacity-70 text-right ${
                        message.role === 'user' ? 'text-gray-200' : 'text-[var(--text-secondary)]'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {/* Follow-up suggestions (assistant only, after last message) */}
                      {message.role === 'assistant' && index === sessionMessages.length - 1 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {followUps.map((q, i) => (
                            <button
                              key={i}
                              className="px-3 py-1 bg-[var(--accent-yellow)] text-[var(--text-primary)] rounded-full text-xs font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition"
                              onClick={() => setInputMessage(q)}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Streaming AI message */}
                {streamingMessage && (
                  <div className="flex gap-3 items-end animate-fade-in">
                    <div className="w-10 h-10 bg-[var(--accent-blue)] border-2 border-[var(--accent-yellow)] rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black">∞</span>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-md text-base leading-relaxed">
                      <span className="whitespace-pre-wrap">{streamingMessage}</span>
                    </div>
                  </div>
                )}
                {/* Typing Indicator */}
                {isAITyping && (
                  <div className="flex gap-3 items-end animate-fade-in">
                    <div className="w-10 h-10 bg-[var(--accent-blue)] border-2 border-[var(--accent-yellow)] rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black">∞</span>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-md text-base leading-relaxed flex items-center gap-2">
                      <span className="text-[var(--text-secondary)] font-medium">AI is typing</span>
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                  </div>
                )}
                {/* Error Message */}
                {chatError && (
                  <div className="flex gap-3 items-end animate-fade-in">
                    <div className="w-10 h-10 bg-red-500 border-2 border-red-300 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black">!</span>
                    </div>
                    <div className="bg-white border border-red-200 p-4 rounded-2xl shadow-md text-base leading-relaxed text-red-600">
                      {chatError}
                    </div>
                  </div>
                )}
                {sendMessageMutation.isPending && (
                  <div className="flex gap-3 items-end animate-fade-in">
                    <div className="w-10 h-10 bg-[var(--accent-blue)] border-2 border-[var(--accent-yellow)] rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 min-w-[120px]">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-[var(--text-secondary)] text-sm font-medium animate-pulse">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {/* Input Area (Sticky) */}
          <div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white/90 to-transparent px-4 pb-4 pt-2">
            <div className="max-w-2xl mx-auto flex items-end gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about management, leadership, or any Level Up topic..."
                className="w-full pr-16 pl-5 py-4 border-2 border-gray-300 rounded-3xl text-base resize-none focus:outline-none focus:border-[var(--accent-yellow)] focus:ring-4 focus:ring-[var(--accent-yellow)] focus:ring-opacity-20 min-h-[56px] max-h-[120px] bg-white shadow-md"
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                className="absolute right-6 bottom-6 w-12 h-12 bg-[var(--accent-blue)] text-white rounded-full flex items-center justify-center hover:bg-[var(--accent-yellow)] hover:text-[var(--text-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                size="icon"
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
