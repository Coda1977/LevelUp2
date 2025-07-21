import { useState, useRef, useEffect, useReducer } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileNav } from "@/components/MobileNav";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  name: string;
  summary: string;
}

interface ChatState {
  sessions: ChatSession[];
  selectedSessionId: string;
  inputMessage: string;
  isAITyping: boolean;
  chatError: string | null;
  streamingMessage: string | null;
  sidebarOpen: boolean;
  chatNameCounter: number;
}

type ChatAction =
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'SELECT_SESSION'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_AI_TYPING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STREAMING'; payload: string | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'INCREMENT_COUNTER' };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SELECT_SESSION':
      return { ...state, selectedSessionId: action.payload };
    case 'SET_INPUT':
      return { ...state, inputMessage: action.payload };
    case 'SET_AI_TYPING':
      return { ...state, isAITyping: action.payload };
    case 'SET_ERROR':
      return { ...state, chatError: action.payload };
    case 'SET_STREAMING':
      return { ...state, streamingMessage: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'INCREMENT_COUNTER':
      return { ...state, chatNameCounter: state.chatNameCounter + 1 };
    default:
      return state;
  }
}

export default function Chat() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [state, dispatch] = useReducer(chatReducer, {
    sessions: [],
    selectedSessionId: '',
    inputMessage: '',
    isAITyping: false,
    chatError: null,
    streamingMessage: null,
    sidebarOpen: false,
    chatNameCounter: 1
  });

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
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          dispatch({ type: 'SET_SESSIONS', payload: data });
          if (data.length > 0 && !data.find((s: any) => s.id === state.selectedSessionId)) {
            dispatch({ type: 'SELECT_SESSION', payload: data[0].id });
          }
        })
        .catch(error => {
          console.error('Failed to load chat sessions:', error);
          toast({
            title: "Error",
            description: "Failed to load chat sessions. Please refresh the page.",
            variant: "destructive",
          });
        });
    }
  }, [isLoading, isAuthenticated, toast]);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/chat/history", state.selectedSessionId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/history/${state.selectedSessionId}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load chat history`);
      }
      return res.json();
    },
    enabled: isAuthenticated && !!state.selectedSessionId,
    retry: 2,
    retryDelay: 1000,
  });

  const sessionMessages = messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate intelligent chat name based on conversation
  const generateChatName = async (currentUserMessage: string) => {
    try {
      const messagesForNaming = [
        ...sessionMessages,
        { role: 'user', content: currentUserMessage, timestamp: new Date().toISOString() }
      ];
      
      const res = await fetch(`/api/chat/session/${state.selectedSessionId}/generate-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForNaming })
      });
      
      if (res.ok) {
        const { name } = await res.json();
        // Update sessions list with the new name
        const sessionRes = await fetch('/api/chat/sessions');
        if (sessionRes.ok) {
          const sessionList = await sessionRes.json();
          dispatch({ type: 'SET_SESSIONS', payload: sessionList });
        }
      }
    } catch (error) {
      console.error('Failed to generate session name:', error);
      // Don't show error to user since this is a nice-to-have feature
      // Silently fail to avoid disrupting the chat experience
    }
  };

  // Simplified sendMessage function
  const sendMessage = async () => {
    if (!state.inputMessage.trim() || state.isAITyping) return;
    
    dispatch({ type: 'SET_AI_TYPING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_STREAMING', payload: '' });
    
    // Ensure UI updates immediately by forcing a re-render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const currentMessage = state.inputMessage;
    dispatch({ type: 'SET_INPUT', payload: '' });

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...sessionMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: currentMessage }
          ],
          sessionId: state.selectedSessionId,
        }),
      });
      
      if (!res.body) throw new Error('No response body');
      
      const reader = res.body.getReader();
      let aiMessage = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data:')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') {
              dispatch({ type: 'SET_AI_TYPING', payload: false });
              dispatch({ type: 'SET_STREAMING', payload: null });
              queryClient.invalidateQueries({ queryKey: ["/api/chat/history", state.selectedSessionId] });
              
              // Auto-generate chat name after first exchange
              const currentSession = state.sessions.find(s => s.id === state.selectedSessionId);
              if (currentSession && currentSession.name.startsWith('New Chat ') && sessionMessages.length >= 1) {
                generateChatName(currentMessage);
              }
              return;
            }
            
            try {
              const { token } = JSON.parse(data);
              if (token) {
                aiMessage += token;
                dispatch({ type: 'SET_STREAMING', payload: aiMessage });
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_AI_TYPING', payload: false });
      dispatch({ type: 'SET_STREAMING', payload: null });
      dispatch({ type: 'SET_ERROR', payload: "AI is temporarily unavailable. Please try again." });
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Copy message to clipboard with permission check
  const copyMessage = async (content: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        toast({ title: 'Copied to clipboard!' });
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast({ title: 'Copied to clipboard!' });
        } catch {
          toast({ title: 'Failed to copy', variant: 'destructive' });
        }
        document.body.removeChild(textArea);
      }
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  // Dynamic follow-up suggestions based on conversation context
  const generateFollowUps = (lastMessage: string): string[] => {
    if (!lastMessage) {
      return [
        'Can you give me a concrete example?',
        'What framework would you use here?',
        'What should I try next week?'
      ];
    }

    // Generate contextual follow-ups based on keywords and content
    const message = lastMessage.toLowerCase();
    
    if (message.includes('team') || message.includes('management') || message.includes('delegate')) {
      return [
        'How do I handle resistance from team members?',
        'What if someone on my team isn\'t meeting expectations?',
        'How can I build more trust with my team?'
      ];
    }
    
    if (message.includes('feedback') || message.includes('performance') || message.includes('review')) {
      return [
        'How do I give feedback without demotivating?',
        'What\'s the best way to document this conversation?',
        'How often should I check in after giving feedback?'
      ];
    }
    
    if (message.includes('conflict') || message.includes('disagreement') || message.includes('tension')) {
      return [
        'What if the conflict escalates further?',
        'How do I stay neutral in team conflicts?',
        'When should I involve HR or upper management?'
      ];
    }
    
    if (message.includes('goal') || message.includes('objective') || message.includes('target')) {
      return [
        'How do I track progress on this goal?',
        'What if we\'re falling behind on our targets?',
        'How do I communicate goal changes to the team?'
      ];
    }
    
    if (message.includes('meeting') || message.includes('1:1') || message.includes('one-on-one')) {
      return [
        'How long should these meetings be?',
        'What if the conversation gets off track?',
        'How do I prepare for difficult conversations?'
      ];
    }
    
    // Default contextual questions
    return [
      'Can you give me a specific example for my situation?',
      'What would you do if this approach doesn\'t work?',
      'How do I implement this starting next week?'
    ];
  };

  const followUps = generateFollowUps(
    sessionMessages.length > 0 
      ? sessionMessages[sessionMessages.length - 1]?.content || ''
      : ''
  );

  // New chat handler - optimized for speed
  const handleNewChat = async () => {
    try {
      // Immediately create optimistic UI
      const newSessionId = `temp-${Date.now()}`;
      const tempSession = {
        id: newSessionId,
        name: `New Chat ${state.chatNameCounter}`,
        summary: ''
      };
      
      // Optimistically update UI first for instant feedback
      dispatch({ type: 'SET_SESSIONS', payload: [...state.sessions, tempSession] });
      dispatch({ type: 'SELECT_SESSION', payload: newSessionId });
      dispatch({ type: 'INCREMENT_COUNTER' });
      
      // Then create the actual session in background
      const res = await fetch('/api/chat/session', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tempSession.name,
          summary: ''
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to create session`);
      }
      
      const newSession = await res.json();
      
      // Update with real session ID
      const updatedSessions = state.sessions.map(s => 
        s.id === newSessionId ? newSession : s
      ).filter(s => s.id !== newSessionId);
      updatedSessions.push(newSession);
      
      dispatch({ type: 'SET_SESSIONS', payload: updatedSessions });
      dispatch({ type: 'SELECT_SESSION', payload: newSession.id });
      
    } catch (error) {
      console.error('Failed to create new chat session:', error);
      // Revert optimistic update on error
      const revertedSessions = state.sessions.filter(s => !s.id.startsWith('temp-'));
      dispatch({ type: 'SET_SESSIONS', payload: revertedSessions });
      if (revertedSessions.length > 0) {
        dispatch({ type: 'SELECT_SESSION', payload: revertedSessions[0].id });
      }
      
      toast({
        title: "Error",
        description: "Failed to create new chat session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete chat handler
  const handleDeleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/session/${chatId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) throw new Error('Failed to delete chat');
      
      const sessionRes = await fetch('/api/chat/sessions');
      const sessionList = await sessionRes.json();
      dispatch({ type: 'SET_SESSIONS', payload: sessionList });
      
      if (state.selectedSessionId === chatId && sessionList.length > 0) {
        dispatch({ type: 'SELECT_SESSION', payload: sessionList[0].id });
      }
      
      toast({
        title: "Chat deleted",
        description: "Your chat session has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat session. Please try again.",
        variant: "destructive",
      });
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

  const handleRenameChat = (chatId: string, newName: string) => {
    dispatch({ 
      type: 'SET_SESSIONS', 
      payload: state.sessions.map(session => 
        session.id === chatId ? { ...session, name: newName } : session
      )
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-gradient-to-b from-[var(--bg-primary)] to-white">
        <ChatSidebar
          sessions={state.sessions}
          selectedSessionId={state.selectedSessionId}
          onSessionSelect={(sessionId) => dispatch({ type: 'SELECT_SESSION', payload: sessionId })}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          isOpen={state.sidebarOpen}
          onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center lg:ml-0">
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
            {sessionMessages.length === 0 && !state.streamingMessage ? (
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
                      onClick={() => dispatch({ type: 'SET_INPUT', payload: prompt.preview })}
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
                              onClick={() => dispatch({ type: 'SET_INPUT', payload: q })}
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
                {state.streamingMessage && (
                  <div className="flex gap-3 items-end animate-fade-in">
                    <div className="w-10 h-10 bg-[var(--accent-blue)] border-2 border-[var(--accent-yellow)] rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black">∞</span>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-md text-base leading-relaxed">
                      <span className="whitespace-pre-wrap">{state.streamingMessage}</span>
                    </div>
                  </div>
                )}
                {/* Typing Indicator */}
                {state.isAITyping && !state.streamingMessage && (
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
                {/* Error Message */}
                {state.chatError && (
                  <div className="flex gap-3 items-end animate-fade-in">
                    <div className="w-10 h-10 bg-red-500 border-2 border-red-300 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black">!</span>
                    </div>
                    <div className="bg-white border border-red-200 p-4 rounded-2xl shadow-md text-base leading-relaxed text-red-600">
                      {state.chatError}
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
                value={state.inputMessage}
                onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about management, leadership, or any Level Up topic..."
                className="w-full pr-16 pl-5 py-4 border-2 border-gray-300 rounded-3xl text-base resize-none focus:outline-none focus:border-[var(--accent-yellow)] focus:ring-4 focus:ring-[var(--accent-yellow)] focus:ring-opacity-20 min-h-[56px] max-h-[120px] bg-white shadow-md"
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!state.inputMessage.trim() || state.isAITyping}
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
    </ErrorBoundary>
  );
}
