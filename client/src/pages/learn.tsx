import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChapterCard } from "@/components/ChapterCard";
import { MobileNav } from "@/components/MobileNav";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Learn() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ["/api/chapters"],
    enabled: isAuthenticated,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

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

  const categoriesWithChapters = categories.map((category: any) => {
    const categoryChapters = chapters
      .filter((c: any) => c.categoryId === category.id)
      .sort((a: any, b: any) => a.chapterNumber - b.chapterNumber)
      .map((chapter: any) => {
        const chapterProgress = progress.find((p: any) => p.chapterId === chapter.id);
        return {
          ...chapter,
          completed: chapterProgress?.completed || false,
        };
      });
    
    const completedCount = categoryChapters.filter(c => c.completed).length;
    
    return {
      ...category,
      chapters: categoryChapters,
      progress: completedCount,
      total: categoryChapters.length,
    };
  });

  const handleChapterClick = (chapter: any) => {
    setLocation(`/chapter/${chapter.slug}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 md:pb-0">
      {/* Header */}
      <section className="py-20 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-headline mb-6">
            Your Learning Journey
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Master management through bite-sized lessons. Progress at your own pace through these three essential areas.
          </p>
        </div>
      </section>

      {/* Categories */}
      {categoriesWithChapters.map((category: any) => (
        <section key={category.id} className="py-16 px-5">
          <div className="max-w-6xl mx-auto">
            {/* Category Header */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border-4 border-[var(--text-primary)] rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-[var(--text-primary)] rounded-lg"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                    <div className="text-[var(--text-secondary)] text-lg prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: category.description }} />
                  </div>
                </div>
                
                <div className="lg:ml-auto text-right">
                  <p className="text-[var(--text-secondary)] mb-2">
                    {category.progress === category.total ? 'Complete!' : 
                     category.progress === 0 ? 'Just getting started' :
                     'Making progress'}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: category.total }, (_, i) => (
                      <div
                        key={i}
                        className={`progress-dot ${
                          i < category.progress 
                            ? 'completed' 
                            : i === category.progress 
                              ? 'current' 
                              : ''
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xl font-bold">
                    {Math.round((category.progress / category.total) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.chapters.map((chapter: any) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onChapterClick={handleChapterClick}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <MobileNav />
    </div>
  );
}
