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

  const handleChapterClick = (chapter: any) => {
    setLocation(`/chapter/${chapter.slug}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 md:pb-0">
      {/* Header */}
      <section className="py-16 md:py-20 px-3 md:px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-headline mb-6 text-3xl md:text-5xl">Your Learning Journey</h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Master management through bite-sized lessons. Progress at your own pace through these three essential areas.
          </p>
        </div>
      </section>

      {/* Categories */}
      {categoriesWithChapters.map((category: any) => (
        <section key={category.id} className="py-12 md:py-16 px-3 md:px-5">
          <div className="max-w-6xl mx-auto">
            {/* Category Header */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8 md:mb-12">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border-4 border-[var(--text-primary)] rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-[var(--text-primary)] rounded-lg"></div>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">{category.title}</h2>
                    <div className="text-[var(--text-secondary)] text-base md:text-lg prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: category.description }} />
                  </div>
                </div>
                <div className="lg:ml-auto text-right">
                  <p className="text-[var(--text-secondary)] mb-2">
                    {category.progress === category.total ? 'Complete!' : 
                     category.progress === 0 ? 'Just getting started' :
                     'Making progress'}
                  </p>
                  <div className="flex items-center gap-2 mb-2 overflow-x-auto">
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
                  <p className="text-lg md:text-xl font-bold">
                    {Math.round((category.progress / category.total) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto">
              {category.lessons.map((chapter: any) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onChapterClick={handleChapterClick}
                />
              ))}
            </div>

            {/* Book Summaries Section */}
            {category.bookSummaries.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  Book Summaries
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {category.bookSummaries.map((book: any) => (
                    <div
                      key={book.id}
                      className={`chapter-card ${book.completed ? 'completed' : ''} cursor-pointer`}
                      onClick={() => handleChapterClick(book)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📖</span>
                            <div className="status-dot ${book.completed ? 'completed' : 'current'}"></div>
                          </div>
                          <span className="text-sm text-[var(--text-secondary)] bg-[var(--accent-yellow)] px-2 py-1 rounded-full">
                            {book.readingTime || 15} min read
                          </span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">{book.title}</h4>
                        {book.author && (
                          <p className="text-sm text-[var(--text-secondary)] mb-3">by {book.author}</p>
                        )}
                        <div className="text-sm text-[var(--text-secondary)] prose prose-sm max-w-none mb-4" 
                             dangerouslySetInnerHTML={{ __html: book.description }} />
                        
                        {/* Audio Player */}
                        {book.audioUrl && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">🎧</span>
                              <span className="text-sm font-medium">Audio Version</span>
                            </div>
                            <audio 
                              controls 
                              className="w-full h-10"
                              src={book.audioUrl}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}

                        {/* Key Takeaways Preview */}
                        {book.keyTakeaways && book.keyTakeaways.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Key Takeaways:</p>
                            <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                              {book.keyTakeaways.slice(0, 2).map((takeaway: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-[var(--accent-yellow)] mt-1">•</span>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                              {book.keyTakeaways.length > 2 && (
                                <li className="text-[var(--accent-yellow)] font-medium">
                                  +{book.keyTakeaways.length - 2} more...
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
      <MobileNav />
    </div>
  );
}
