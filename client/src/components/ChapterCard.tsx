import { type Chapter } from "@shared/schema";
import { Clock } from "lucide-react";

interface ChapterCardProps {
  chapter: Chapter & { completed?: boolean; chapterNumber?: number };
  onChapterClick: (chapter: Chapter) => void;
}

export function ChapterCard({ chapter, onChapterClick }: ChapterCardProps) {
  return (
    <div 
      className={`chapter-card p-8 cursor-pointer ${chapter.completed ? 'completed' : ''}`}
      onClick={() => onChapterClick(chapter)}
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-2">
          <div className={`status-dot ${chapter.completed ? 'completed' : 'current'}`} />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {chapter.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>
        <span className="text-sm font-semibold text-[var(--text-secondary)]">
          Chapter {chapter.chapterNumber || chapter.id}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-blue)]">
        {chapter.title}
      </h3>
      
      <p className="text-[var(--text-secondary)] text-base leading-6 mb-5">
        {chapter.preview}
      </p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {chapter.duration}
        </span>
        <span className="text-sm font-semibold text-[var(--accent-blue)]">
          Read Chapter →
        </span>
      </div>
    </div>
  );
}
