import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Clock, CheckCircle, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

export default function Chapter() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, params] = useRoute("/chapter/:slug");
  const [, setLocation] = useLocation();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: chapter, isLoading: chapterLoading } = useQuery({
    queryKey: ["/api/chapters", params?.slug],
    enabled: isAuthenticated && !!params?.slug,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const chapterProgress = progress.find((p: any) => p.chapterId === chapter?.id);
  const isCompleted = chapterProgress?.completed || false;
  const category = categories.find((c: any) => c.id === chapter?.categoryId);

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/progress/${chapter.id}`, { completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Chapter completed!",
        description: "Great job! Keep up the momentum.",
      });
    },
    onError: (error) => {
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
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const shareChapterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/chapters/${chapter.id}/share`);
      return response.json();
    },
    onSuccess: (data) => {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/shared/${data.shareId}`);
      setShowShareModal(true);
    },
    onError: (error) => {
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
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard.",
      });
      setShowShareModal(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || chapterLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent-yellow)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Button onClick={() => setLocation("/learn")}>
            Return to Learn
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Chapter Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/learn")}
              className="text-[var(--accent-blue)] hover:text-[var(--accent-yellow)] transition-colors p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Learn
            </Button>
            <span className="text-[var(--text-secondary)]">•</span>
            <span className="text-[var(--text-secondary)]">{category?.title}</span>
          </div>
          <h1 className="hero-headline mb-4">{chapter.title}</h1>
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {chapter.duration}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Chapter Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-8">
          <div className="prose prose-lg max-w-none">
            {chapter.content ? (
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            ) : (
              <div>
                <p className="text-lg mb-6">{chapter.preview}</p>
                <p className="mb-4">
                  The transition from individual contributor to manager is one of the most challenging career moves you'll make. 
                  It requires a fundamental shift in how you think about your role and measure success.
                </p>
                <h3 className="text-xl font-bold mb-3">The Shift in Mindset</h3>
                <p className="mb-4">
                  As an individual contributor, your value came from your personal output. As a manager, your value comes from 
                  the output of your team. This isn't just a different way of working—it's a different way of thinking.
                </p>
                <h3 className="text-xl font-bold mb-3">Your New Priorities</h3>
                <p className="mb-4">
                  Instead of focusing on tasks, you now focus on people. Instead of solving problems yourself, you help others 
                  solve problems. Instead of being the expert, you become the enabler.
                </p>
                <h3 className="text-xl font-bold mb-3">Making the Mental Switch</h3>
                <p>
                  The hardest part isn't learning new skills—it's letting go of old ones. You need to resist the urge to jump 
                  in and fix things yourself. Your job is to build capability in others.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Media Section */}
        {(chapter.youtubeUrl || chapter.spotifyUrl) && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-6">Listen & Watch</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {chapter.spotifyUrl && (
                <div>
                  <h4 className="font-semibold mb-3">🎧 Podcast</h4>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-[var(--text-secondary)]">Spotify Player</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      "{chapter.title} - Podcast"
                    </p>
                  </div>
                </div>
              )}
              {chapter.youtubeUrl && (
                <div>
                  <h4 className="font-semibold mb-3">📺 Video</h4>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-[var(--text-secondary)]">YouTube Player</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      "{chapter.title} Explained"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isCompleted ? (
            <Button
              onClick={() => markCompleteMutation.mutate()}
              disabled={markCompleteMutation.isPending}
              className="bg-[var(--accent-blue)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--accent-yellow)] hover:text-[var(--text-primary)] transition-all duration-300"
            >
              {markCompleteMutation.isPending ? "Updating..." : "Mark as Complete"}
            </Button>
          ) : (
            <Button
              onClick={() => shareChapterMutation.mutate()}
              disabled={shareChapterMutation.isPending}
              className="bg-[var(--accent-yellow)] text-[var(--text-primary)] px-8 py-4 rounded-full font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {shareChapterMutation.isPending ? "Creating..." : "Share Chapter"}
            </Button>
          )}
          <Button
            onClick={() => setLocation("/learn")}
            variant="outline"
            className="border-2 border-[var(--text-primary)] text-[var(--text-primary)] px-8 py-4 rounded-full font-semibold hover:bg-[var(--text-primary)] hover:text-white transition-all duration-300"
          >
            Continue Learning
          </Button>
        </div>

        {/* Try This Week Section */}
        {isCompleted && chapter.tryThisWeek && (
          <div className="mt-12 bg-[var(--accent-yellow)] p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">💡 Try This Week</h3>
            <p className="text-[var(--text-primary)]">
              {chapter.tryThisWeek}
            </p>
          </div>
        )}

        {isCompleted && !chapter.tryThisWeek && (
          <div className="mt-12 bg-[var(--accent-yellow)] p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">💡 Try This Week</h3>
            <p className="text-[var(--text-primary)]">
              This week, identify one task you typically do yourself that you could delegate to a team member. 
              Schedule 30 minutes to teach them how to do it and set clear expectations for the outcome.
            </p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Chapter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)]">
              Share this chapter with your team members. The link will be active for 10 days.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-mono text-[var(--text-secondary)] break-all">
                {shareUrl}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={copyToClipboard}
                className="flex-1 bg-[var(--accent-yellow)] text-[var(--text-primary)] hover:bg-[var(--accent-blue)] hover:text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={() => setShowShareModal(false)}
                variant="ghost"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
