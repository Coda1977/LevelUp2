import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import { MobileNav } from "@/components/MobileNav";
import { useToast } from "@/hooks/use-toast";

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: chapters = [] } = useQuery<any[]>({ queryKey: ["/api/chapters"] });
  const { data: categories = [] } = useQuery<any[]>({ queryKey: ["/api/categories"] });

  const chapter = chapters.find((c: any) => c.slug === slug);
  const category = categories.find((c: any) => c.id === chapter?.categoryId);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[var(--text-secondary)]">
        Chapter not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-primary)] to-white pb-20 md:pb-0">
      {/* Header */}
      <section className="py-8 md:py-12 px-3 md:px-5 bg-white/90 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            className="mb-4 px-4 py-2 bg-[var(--accent-yellow)] text-[var(--text-primary)] rounded-full font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition"
            onClick={() => setLocation(category ? `/category/${category.slug}` : '/learn')}
          >
            ← Back to {category?.title || 'Categories'}
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            {chapter.contentType === 'book_summary' && (
              <span className="bg-[var(--accent-blue)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                📚 Book Summary
              </span>
            )}
            <span className="text-[var(--text-secondary)] text-sm">
              Chapter {chapter.chapterNumber} • {chapter.estimatedMinutes} min read
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight text-[var(--text-primary)]">
            {chapter.title}
          </h1>
          
          {chapter.description && (
            <div className="text-[var(--text-secondary)] text-lg mb-6 prose prose-lg max-w-none" 
                 dangerouslySetInnerHTML={{ __html: chapter.description }} />
          )}

          {/* Book Summary Metadata */}
          {chapter.contentType === 'book_summary' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {chapter.author && (
                  <div>
                    <span className="font-semibold text-[var(--text-secondary)]">Author:</span>
                    <span className="ml-2 text-[var(--text-primary)]">{chapter.author}</span>
                  </div>
                )}
                {chapter.readingTime && (
                  <div>
                    <span className="font-semibold text-[var(--text-secondary)]">Original Length:</span>
                    <span className="ml-2 text-[var(--text-primary)]">{chapter.readingTime} hours</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-[var(--text-secondary)]">Summary Time:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{chapter.estimatedMinutes} minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* Audio Player */}
          {chapter.audioUrl && (
            <div className="mb-6">
              <AudioPlayer 
                src={chapter.audioUrl} 
                title={`Listen to: ${chapter.title}`}
                className="max-w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-3 md:px-5 py-8 md:py-12">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: chapter.content || '' }} />
        </div>

        {/* Key Takeaways for Book Summaries */}
        {chapter.contentType === 'book_summary' && chapter.keyTakeaways && chapter.keyTakeaways.length > 0 && (
          <div className="mt-8 p-6 bg-[var(--accent-yellow)]/10 rounded-lg border border-[var(--accent-yellow)]/20">
            <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
              🔑 Key Takeaways
            </h3>
            <ul className="space-y-2">
              {chapter.keyTakeaways.map((takeaway: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[var(--accent-blue)] font-bold">•</span>
                  <span className="text-[var(--text-primary)]">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Media Links */}
        <div className="mt-8 space-y-4">
          {chapter.podcastUrl && (
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                🎧 {chapter.podcastHeader || 'Podcast'}
              </h4>
              <a 
                href={chapter.podcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                Listen on External Platform →
              </a>
            </div>
          )}
          
          {chapter.videoUrl && (
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                📺 {chapter.videoHeader || 'Video'}
              </h4>
              <a 
                href={chapter.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                Watch Video →
              </a>
            </div>
          )}
        </div>
      </section>

      <MobileNav />
    </div>
  );
}