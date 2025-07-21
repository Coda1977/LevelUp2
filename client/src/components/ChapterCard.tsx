import { type Chapter } from "@shared/schema";
import { Clock, Eye, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ChapterCardProps {
  chapter: Chapter & { completed?: boolean; chapterNumber?: number };
  onChapterClick: (chapter: Chapter) => void;
}

export function ChapterCard({ chapter, onChapterClick }: ChapterCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  // Extract key points from content (first 3 bullet points or sentences)
  const getKeyPoints = () => {
    if (!chapter.content) return [];
    
    // Try to find bullet points first
    const bulletPoints = chapter.content.match(/[•\-\*]\s*(.+)/g);
    if (bulletPoints && bulletPoints.length > 0) {
      return bulletPoints.slice(0, 3).map(point => point.replace(/[•\-\*]\s*/, '').trim());
    }
    
    // Fallback to sentences
    const sentences = chapter.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim());
  };
  
  const keyPoints = getKeyPoints();
  
  const handlePreviewToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(!showPreview);
  };

  return (
    <div className={`chapter-card p-8 cursor-pointer ${chapter.completed ? 'completed' : ''}`}>
      <div onClick={() => onChapterClick(chapter)}>
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
      
      {/* Preview Section */}
      {keyPoints.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={handlePreviewToggle}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-blue)] hover:text-[var(--accent-yellow)] transition-colors w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview Key Points
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPreview ? 'rotate-180' : ''}`} />
          </button>
          
          {showPreview && (
            <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--accent-yellow)] mt-1 font-bold">•</span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
              <div className="text-xs text-[var(--text-secondary)] italic mt-3 pt-2 border-t border-gray-100">
                Click above to read the full chapter
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
