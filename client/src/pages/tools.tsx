import { useAuth } from "@/hooks/useAuth";
import { MobileNav } from "@/components/MobileNav";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToolModal } from "@/components/ToolModal";

export default function Tools() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<any>(null);

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

  const tools = [
    {
      id: 1,
      title: 'Your Life in Weeks',
      description: 'Visual life planning tool to see the big picture',
      icon: '📅',
      category: 'Planning'
    },
    {
      id: 2,
      title: 'Email Writing Assistant',
      description: 'Professional email composer with AI help',
      icon: '✉️',
      category: 'Communication'
    },
    {
      id: 3,
      title: 'Origin Stories',
      description: 'Personal and company story creator',
      icon: '📖',
      category: 'Storytelling'
    },
    {
      id: 4,
      title: 'Meeting Summary',
      description: 'AI-powered meeting notes and action items',
      icon: '📝',
      category: 'Productivity'
    },
    {
      id: 5,
      title: '5 Whys',
      description: 'Root cause analysis tool for problem solving',
      icon: '🔍',
      category: 'Problem Solving'
    },
    {
      id: 6,
      title: 'Team Activity Ideas',
      description: 'Creative team building suggestions',
      icon: '🎯',
      category: 'Team Building'
    },
    {
      id: 7,
      title: 'Idea Spark',
      description: 'Brainstorming and ideation assistant',
      icon: '💡',
      category: 'Creativity'
    },
    {
      id: 8,
      title: 'Feedback Framework',
      description: 'Structure difficult conversations',
      icon: '💬',
      category: 'Communication'
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
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 md:pb-0">
      {/* Header */}
      <section className="py-20 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-headline mb-6">
            Simple Tools for Daily Use
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Practical AI-powered tools to help you in your daily management work
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  console.log(`Opening tool: ${tool.title}`);
                  setSelectedTool(tool);
                }}
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <div className="mb-4">
                  <span className="text-xs font-semibold text-[var(--accent-blue)] bg-[var(--accent-yellow)] px-2 py-1 rounded-full">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--accent-blue)] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-base leading-6 mb-6">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Click to open
                  </span>
                  <svg className="w-5 h-5 text-[var(--accent-blue)] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileNav />
      
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}
