import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CategoryCard } from "@/components/CategoryCard";
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

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const { data: chapters = [] } = useQuery<any[]>({
    queryKey: ["/api/chapters"],
    enabled: isAuthenticated,
  });

  const { data: progress = [] } = useQuery<any[]>({
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
    
    // Separate lessons and book summaries
    const lessons = categoryChapters.filter((c: any) => c.contentType === 'lesson' || !c.contentType);
    const bookSummaries = categoryChapters.filter((c: any) => c.contentType === 'book_summary');
    
    const completedCount = categoryChapters.filter((c: any) => c.completed).length;
    
    return {
      ...category,
      lessons,
      bookSummaries,
      chapters: categoryChapters, // Keep for backward compatibility
      progress: completedCount,
      total: categoryChapters.length,
    };
  });

  const handleCategoryClick = (category: any) => {
    setLocation(`/category/${category.slug}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 md:pb-0">
      {/* Hero Header */}
      <section className="py-20 md:py-32 px-5 md:px-10 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Geometric accent shapes */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-[var(--accent-yellow)] opacity-20 transform rotate-45 rounded-lg hidden md:block"></div>
            <div className="absolute -bottom-5 -left-10 w-16 h-16 bg-[var(--accent-blue)] opacity-15 rounded-full hidden md:block"></div>
          </div>
          
          <h1 className="text-[clamp(48px,8vw,80px)] font-black tracking-[-2px] leading-[1.1] mb-8 text-[var(--text-primary)]">
            Your Learning<br />Journey
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Master management through focused learning paths. Choose your area of growth and progress at your own pace through curated lessons and book summaries.
          </p>
        </div>
      </section>

      {/* Overall Progress */}
      <section className="py-12 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--white)] p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                Overall Progress
              </h2>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {categoriesWithChapters.map((category: any) => {
                  const percentage = Math.round((category.progress / (category.total || 1)) * 100);
                  return (
                    <div key={category.id} className="text-center">
                      <div className="text-3xl font-black text-[var(--accent-blue)] mb-2">
                        {percentage}%
                      </div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">
                        {category.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="py-12 md:py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-1px] mb-6 text-[var(--text-primary)]">
              Choose Your Focus
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Each category is designed to build specific management skills through practical lessons and insights from top business books.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithChapters.map((category: any) => (
              <CategoryCard
                key={category.id}
                category={category}
                onCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  );
}
