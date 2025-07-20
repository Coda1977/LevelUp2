import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ChapterCard } from "@/components/ChapterCard";
import { MobileNav } from "@/components/MobileNav";
import { useToast } from "@/hooks/use-toast";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<any[]>({ queryKey: ["/api/categories"] });
  const { data: chapters = [] } = useQuery<any[]>({ queryKey: ["/api/chapters"] });
  const { data: progress = [] } = useQuery<any[]>({ queryKey: ["/api/progress"] });

  const category = categories.find((c: any) => c.slug === slug);
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[var(--text-secondary)]">Category not found</div>
    );
  }

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
  const lessons = categoryChapters.filter((c: any) => c.contentType === 'lesson' || !c.contentType);
  const bookSummaries = categoryChapters.filter((c: any) => c.contentType === 'book_summary');
  const completedCount = categoryChapters.filter((c: any) => c.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-primary)] to-white pb-20 md:pb-0">
      {/* Hero/Header */}
      <section className="py-16 md:py-20 px-3 md:px-5 text-center bg-white/90 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <button
            className="mb-6 px-4 py-2 bg-[var(--accent-yellow)] text-[var(--text-primary)] rounded-full font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition"
            onClick={() => setLocation('/learn')}
          >
            ← Back to All Categories
          </button>
          <div className="w-20 h-20 bg-[var(--accent-blue)] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl font-black">{category.title.charAt(0)}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">{category.title}</h1>
          <div className="text-[var(--text-secondary)] text-lg md:text-xl mb-6 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: category.description }} />
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              {Array.from({ length: categoryChapters.length }, (_, i) => (
                <div
                  key={i}
                  className={`progress-dot ${i < completedCount ? 'completed' : i === completedCount ? 'current' : ''}`}
                />
              ))}
            </div>
            <span className="text-lg font-bold">{Math.round((completedCount / (categoryChapters.length || 1)) * 100)}% Complete</span>
          </div>
        </div>
      </section>

      {/* Lessons & Book Summaries */}
      <section className="max-w-5xl mx-auto px-3 md:px-5 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Lessons */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-2xl">📖</span> Lessons
            </h2>
            {lessons.length === 0 ? (
              <div className="text-[var(--text-secondary)] text-lg">No lessons yet for this category.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {lessons.map((chapter: any) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onChapterClick={() => setLocation(`/chapter/${chapter.slug}`)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Book Summaries */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-2xl">📚</span> Book Summaries
            </h2>
            {bookSummaries.length === 0 ? (
              <div className="text-[var(--text-secondary)] text-lg">No book summaries yet for this category.</div>
            ) : (
              <div className="grid md:grid-cols-1 gap-6">
                {bookSummaries.map((book: any) => (
                  <div
                    key={book.id}
                    className={`chapter-card ${book.completed ? 'completed' : ''} cursor-pointer`}
                    onClick={() => setLocation(`/chapter/${book.slug}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📖</span>
                          <div className={`status-dot ${book.completed ? 'completed' : 'current'}`}></div>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <MobileNav />
    </div>
  );
} 