import { useState, useEffect, lazy, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, BookOpen, FolderPlus } from "lucide-react";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AudioRecorder } from "@/components/ui/AudioRecorder";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Add types for Category and Chapter
interface Category {
  id: number;
  title: string;
  description: string;
  sortOrder: number;
}

interface Chapter {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  categoryId: number;
  chapterNumber: number;
  estimatedMinutes: number;
  podcastUrl?: string;
  podcastHeader?: string;
  videoUrl?: string;
  videoHeader?: string;
  // Book summary fields
  contentType?: 'lesson' | 'book_summary';
  author?: string;
  readingTime?: number;
  keyTakeaways?: string[];
  audioUrl?: string;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  // Add preview mode state
  const [previewMode, setPreviewMode] = useState(false);
  // Add content type state
  const [contentType, setContentType] = useState<'lesson' | 'book_summary'>('lesson');

  // Category form state
  const [categoryData, setCategoryData] = useState({
    title: "",
    description: "",
    sortOrder: 1,
  });

  // Chapter form state
  const [chapterData, setChapterData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    categoryId: "",
    chapterNumber: 1,
    estimatedMinutes: 5,
    podcastUrl: "",
    podcastHeader: "Podcast",
    videoUrl: "",
    videoHeader: "Video",
    // Book summary fields
    contentType: 'lesson' as 'lesson' | 'book_summary',
    author: "",
    readingTime: 15,
    keyTakeaways: [] as string[],
    audioUrl: "",
  });

  // Auto-save draft to localStorage
  useEffect(() => {
    if (showChapterForm) {
      const savedDraft = localStorage.getItem('chapterDraft');
      if (savedDraft) {
        setChapterData(JSON.parse(savedDraft));
      }
    }
  }, [showChapterForm]);

  useEffect(() => {
    if (showChapterForm) {
      localStorage.setItem('chapterDraft', JSON.stringify(chapterData));
    }
  }, [chapterData, showChapterForm]);

  // Fetch categories and chapters
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Pagination state for chapters
  const [chapterPage, setChapterPage] = useState(1);
  const chapterPageSize = 10;

  // Fetch paginated chapters
  const { data: chapters = [], isLoading: chaptersLoading } = useQuery<Chapter[]>({
    queryKey: ["/api/chapters", chapterPage, chapterPageSize],
    queryFn: async () => {
      const res = await fetch(`/api/chapters?page=${chapterPage}&pageSize=${chapterPageSize}`);
      return res.json();
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof categoryData) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setCategoryData({ title: "", description: "", sortOrder: 1 });
      setShowCategoryForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create chapter mutation
  const createChapterMutation = useMutation({
    mutationFn: async (data: typeof chapterData) => {
      const response = await apiRequest("POST", "/api/chapters", {
        ...data,
        categoryId: parseInt(data.categoryId),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Chapter created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      setChapterData({
        title: "",
        slug: "",
        description: "",
        content: "",
        categoryId: "",
        chapterNumber: 1,
        estimatedMinutes: 5,
        podcastUrl: "",
        podcastHeader: "Podcast",
        videoUrl: "",
        videoHeader: "Video",
        contentType: 'lesson',
        author: "",
        readingTime: 15,
        keyTakeaways: [],
        audioUrl: "",
      });
      setShowChapterForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update chapter mutation
  const updateChapterMutation = useMutation({
    mutationFn: async (data: typeof chapterData & { id: number }) => {
      const response = await apiRequest("PUT", `/api/chapters/${data.id}`, {
        ...data,
        categoryId: parseInt(data.categoryId),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Chapter updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      setChapterData({
        title: "",
        slug: "",
        description: "",
        content: "",
        categoryId: "",
        chapterNumber: 1,
        estimatedMinutes: 5,
        podcastUrl: "",
        podcastHeader: "Podcast",
        videoUrl: "",
        videoHeader: "Video",
        contentType: 'lesson',
        author: "",
        readingTime: 15,
        keyTakeaways: [],
        audioUrl: "",
      });
      setEditChapter(null);
      setShowChapterForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Edit/delete state
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteChapterId, setDeleteChapterId] = useState<number | null>(null);

  // Bulk selection state for chapters
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);

  const handleSelectChapter = (id: number, checked: boolean) => {
    setSelectedChapters((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  const handleSelectAllChapters = (checked: boolean) => {
    if (checked) {
      setSelectedChapters(chapters.map((c) => c.id));
    } else {
      setSelectedChapters([]);
    }
  };

  const handleBulkDeleteChapters = () => {
    if (window.confirm('Delete all selected chapters? This cannot be undone.')) {
      selectedChapters.forEach((id) => deleteChapterMutation.mutate(id));
      setSelectedChapters([]);
    }
  };

  // Handle drag end for chapters
  const handleChapterDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(chapters);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    // Update order in state (for UI)
    // Optionally, send new order to backend here
    // setChapters(reordered); // If using local state
    // Persist new order to backend
    const order = reordered.map((chapter, idx) => ({ id: chapter.id, chapterNumber: idx + 1 }));
    fetch('/api/chapters/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
  };

  // Bulk selection state for categories
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleSelectCategory = (id: number, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map((c) => c.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleBulkDeleteCategories = () => {
    if (window.confirm('Delete all selected categories? This cannot be undone.')) {
      selectedCategories.forEach((id) => deleteCategoryMutation.mutate(id));
      setSelectedCategories([]);
    }
  };

  // Handle drag end for categories
  const handleCategoryDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(categories);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    // Persist new order to backend
    const order = reordered.map((cat, idx) => ({ id: cat.id, sortOrder: idx + 1 }));
    fetch('/api/categories/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
  };

  // Mutations for delete
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Category deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setDeleteCategoryId(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
  const deleteChapterMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/chapters/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Chapter deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      setDeleteChapterId(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Edit handlers
  function handleEditCategory(category: Category) {
    setEditCategory(category);
    setShowCategoryForm(true);
    setCategoryData({
      title: category.title,
      description: category.description,
      sortOrder: category.sortOrder,
    });
  }
  function handleEditChapter(chapter: Chapter) {
    setEditChapter(chapter);
    setShowChapterForm(true);
    setChapterData({
      title: chapter.title,
      slug: chapter.slug,
      description: chapter.description,
      content: chapter.content,
      categoryId: chapter.categoryId.toString(),
      chapterNumber: chapter.chapterNumber,
      estimatedMinutes: chapter.estimatedMinutes,
      podcastUrl: chapter.podcastUrl || "",
      podcastHeader: chapter.podcastHeader || "Podcast",
      videoUrl: chapter.videoUrl || "",
      videoHeader: chapter.videoHeader || "Video",
      contentType: chapter.contentType || 'lesson',
      author: chapter.author || "",
      readingTime: chapter.readingTime || 15,
      keyTakeaways: chapter.keyTakeaways || [],
      audioUrl: chapter.audioUrl || "",
    });
  }

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(categoryData);
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editChapter) {
      // Update existing chapter
      updateChapterMutation.mutate({ ...chapterData, id: editChapter.id });
    } else {
      // Create new chapter
      createChapterMutation.mutate(chapterData);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Helper to render media embed
  function renderMediaEmbed(url: string) {
    if (!url) return null;
    // Spotify
    if (url.includes("spotify.com/episode/") || url.includes("spotify.com/show/")) {
      return (
        <iframe
          src={url.replace("/show/", "/embed/show/").replace("/episode/", "/embed/episode/")}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg my-4"
        ></iframe>
      );
    }
    // YouTube
    const ytMatch = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    if (ytMatch) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          width="100%"
          height="315"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg my-4"
        ></iframe>
      );
    }
    // TED
    const tedMatch = url.match(/ted.com\/talks\/([\w-]+)/);
    if (tedMatch) {
      return (
        <iframe
          src={`https://embed.ted.com/talks/${tedMatch[1]}`}
          width="100%"
          height="315"
          frameBorder="0"
          allowFullScreen
          className="rounded-lg my-4"
        ></iframe>
      );
    }
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-5 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
          Content Management
        </h1>
        <p className="text-[var(--text-secondary)] text-lg md:text-xl">
          Add and manage learning content for Level Up
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
        {/* Categories Section with Drag-and-Drop and Bulk Actions */}
        <DragDropContext onDragEnd={handleCategoryDragEnd}>
          <Droppable droppableId="category-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Categories</h2>
                  <Button
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="bg-[var(--accent-yellow)] text-[var(--text-primary)] hover:bg-[var(--accent-yellow)]/80 text-lg font-semibold px-6 py-3 shadow-md"
                  >
                    <FolderPlus className="w-5 h-5 mr-2" />
                    Add Category
                  </Button>
                </div>

                {showCategoryForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Create New Category</CardTitle>
                      <CardDescription>
                        Categories group related learning content together
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div>
                          <Label htmlFor="categoryTitle">Title</Label>
                          <Input
                            id="categoryTitle"
                            value={categoryData.title}
                            onChange={(e) => setCategoryData({ ...categoryData, title: e.target.value })}
                            placeholder="e.g., Leadership Foundations"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="categoryDescription">Description</Label>
                          <TiptapEditor
                            value={categoryData.description}
                            onChange={(html) => setCategoryData({ ...categoryData, description: html })}
                            placeholder="Brief description of what this category covers"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sortOrder">Sort Order</Label>
                          <Input
                            id="sortOrder"
                            type="number"
                            value={categoryData.sortOrder}
                            onChange={(e) => setCategoryData({ ...categoryData, sortOrder: parseInt(e.target.value) })}
                            min="1"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            type="submit" 
                            disabled={createCategoryMutation.isPending}
                            className="bg-[var(--text-primary)] text-[var(--bg-primary)]"
                          >
                            {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCategoryForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {categories.length === 0 ? (
                    <p className="text-[var(--text-secondary)] text-center py-8">
                      No categories yet. Create your first category to get started.
                    </p>
                  ) : (
                    categories.map((category: Category, index: number) => (
                      <Draggable key={category.id} draggableId={category.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-shadow ${snapshot.isDragging ? 'shadow-2xl' : ''}`}
                          >
                            <Card>
                              <CardContent className="p-6 md:p-8 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={(e) => handleSelectCategory(category.id, e.target.checked)}
                                    className="w-5 h-5"
                                  />
                                  <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] text-lg md:text-xl mb-1">{category.title}</h3>
                                    <div className="text-base md:text-lg text-[var(--text-secondary)] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: category.description }} />
                                    <div className="text-sm md:text-base text-[var(--text-secondary)] mt-2">Order: {category.sortOrder}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>Edit</Button>
                                  <Button size="sm" variant="destructive" onClick={() => setDeleteCategoryId(category.id)}>Delete</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Chapters Section */}
        <div>
          <div className="border-t border-gray-200 mb-8 pt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Chapters</h2>
              <Button
                onClick={() => setShowChapterForm(!showChapterForm)}
                className="bg-[var(--accent-yellow)] text-[var(--text-primary)] hover:bg-[var(--accent-yellow)]/80 text-lg font-semibold px-6 py-3 shadow-md"
                disabled={categories.length === 0}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Chapter
              </Button>
            </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              type="button"
              variant="outline"
              disabled={chapterPage === 1}
              onClick={() => setChapterPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span>Page {chapterPage}</span>
            <Button
              type="button"
              variant="outline"
              disabled={chapters.length < chapterPageSize}
              onClick={() => setChapterPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>

          {/* Bulk Actions Controls */}
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={selectedChapters.length === chapters.length && chapters.length > 0}
              onChange={(e) => handleSelectAllChapters(e.target.checked)}
              className="w-5 h-5 mr-2"
            />
            <span>Select All</span>
            <Button
              type="button"
              variant="destructive"
              disabled={selectedChapters.length === 0}
              onClick={handleBulkDeleteChapters}
            >
              Delete Selected
            </Button>
          </div>

          {categories.length === 0 && (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-[var(--text-secondary)] mb-4" />
                <p className="text-[var(--text-secondary)]">
                  Create at least one category before adding chapters
                </p>
              </CardContent>
            </Card>
          )}

          {/* Full-screen Dialog for Chapter Form */}
          <Dialog open={showChapterForm && categories.length > 0} onOpenChange={setShowChapterForm}>
            <DialogContent className="fixed inset-0 w-full h-full max-w-none max-h-none p-0 bg-white flex flex-col z-50 overflow-y-auto">
              <div className="flex items-center justify-between px-8 py-6 border-b">
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {editChapter ? 'Edit Chapter' : 'Create New Chapter'}
                  </DialogTitle>
                  <DialogDescription>
                    {editChapter ? 'Update the chapter details and content' : 'Add a new learning chapter with content and media'}
                  </DialogDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowChapterForm(false)} className="text-2xl px-4 py-2">✕</Button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col items-center">
                <div className="w-full max-w-3xl flex justify-end mb-4">
                  <Button
                    type="button"
                    variant={previewMode ? "default" : "outline"}
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                </div>
                <form onSubmit={handleCreateChapter} className="w-full max-w-3xl space-y-6">
                  {previewMode ? (
                    <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 mt-2">
                      <div className="prose prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: chapterData.content }} />
                      </div>
                      {chapterData.podcastUrl && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold mb-4">{chapterData.podcastHeader}</h3>
                          {renderMediaEmbed(chapterData.podcastUrl)}
                        </div>
                      )}
                      {chapterData.videoUrl && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold mb-4">{chapterData.videoHeader}</h3>
                          {renderMediaEmbed(chapterData.videoUrl)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Suspense fallback={<div className='p-8 text-center'>Loading editor...</div>}>
                      <TiptapEditor
                        value={chapterData.content}
                        onChange={(html) => setChapterData({ ...chapterData, content: html })}
                        placeholder="Main content of the chapter (rich formatting supported)"
                      />
                    </Suspense>
                  )}
                  <div>
                    <Label htmlFor="chapterTitle">Title</Label>
                    <Input
                      id="chapterTitle"
                      value={chapterData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setChapterData({ 
                          ...chapterData, 
                          title,
                          slug: generateSlug(title)
                        });
                      }}
                      placeholder="e.g., Building Trust with Your Team"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select 
                      value={chapterData.contentType} 
                      onValueChange={(value: 'lesson' | 'book_summary') => setChapterData({ ...chapterData, contentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lesson">📝 Lesson</SelectItem>
                        <SelectItem value="book_summary">📚 Book Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {chapterData.contentType === 'book_summary' && (
                    <>
                      <div>
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          value={chapterData.author}
                          onChange={(e) => setChapterData({ ...chapterData, author: e.target.value })}
                          placeholder="e.g., Jim Collins"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                        <Input
                          id="readingTime"
                          type="number"
                          value={chapterData.readingTime}
                          onChange={(e) => setChapterData({ ...chapterData, readingTime: parseInt(e.target.value) })}
                          min="1"
                          placeholder="15"
                        />
                      </div>
                      <div>
                        <Label htmlFor="keyTakeaways">Key Takeaways (one per line)</Label>
                        <textarea
                          id="keyTakeaways"
                          value={chapterData.keyTakeaways.join('\n')}
                          onChange={(e) => setChapterData({ 
                            ...chapterData, 
                            keyTakeaways: e.target.value.split('\n').filter(takeaway => takeaway.trim())
                          })}
                          placeholder="Enter key takeaways, one per line..."
                          className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
                        />
                      </div>
                      <div>
                        <AudioRecorder
                          audioUrl={chapterData.audioUrl}
                          onAudioUrlChange={(url) => setChapterData({ ...chapterData, audioUrl: url })}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="chapterSlug">URL Slug</Label>
                    <Input
                      id="chapterSlug"
                      value={chapterData.slug}
                      onChange={(e) => setChapterData({ ...chapterData, slug: e.target.value })}
                      placeholder="building-trust-with-your-team"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categorySelect">Category</Label>
                    <Select 
                      value={chapterData.categoryId} 
                      onValueChange={(value) => setChapterData({ ...chapterData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chapterNumber">Chapter Number</Label>
                      <Input
                        id="chapterNumber"
                        type="number"
                        value={chapterData.chapterNumber}
                        onChange={(e) => setChapterData({ ...chapterData, chapterNumber: parseInt(e.target.value) })}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedMinutes">Duration (minutes)</Label>
                      <Input
                        id="estimatedMinutes"
                        type="number"
                        value={chapterData.estimatedMinutes}
                        onChange={(e) => setChapterData({ ...chapterData, estimatedMinutes: parseInt(e.target.value) })}
                        min="1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="chapterDescription">Description</Label>
                    <TiptapEditor
                      value={chapterData.description}
                      onChange={(html) => setChapterData({ ...chapterData, description: html })}
                      placeholder="Brief description of the chapter content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="podcastUrl">Podcast URL (Spotify, optional)</Label>
                    <Input
                      id="podcastUrl"
                      value={chapterData.podcastUrl}
                      onChange={(e) => setChapterData({ ...chapterData, podcastUrl: e.target.value })}
                      placeholder="Spotify episode or show URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="podcastHeader">Podcast Header</Label>
                    <Input
                      id="podcastHeader"
                      value={chapterData.podcastHeader}
                      onChange={(e) => setChapterData({ ...chapterData, podcastHeader: e.target.value })}
                      placeholder="e.g., Listen & Learn"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl">Video URL (YouTube or TED, optional)</Label>
                    <Input
                      id="videoUrl"
                      value={chapterData.videoUrl}
                      onChange={(e) => setChapterData({ ...chapterData, videoUrl: e.target.value })}
                      placeholder="YouTube or TED talk URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoHeader">Video Header</Label>
                    <Input
                      id="videoHeader"
                      value={chapterData.videoHeader}
                      onChange={(e) => setChapterData({ ...chapterData, videoHeader: e.target.value })}
                      placeholder="e.g., Watch This"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={createChapterMutation.isPending || updateChapterMutation.isPending}
                      className="bg-[var(--text-primary)] text-[var(--bg-primary)]"
                    >
                      {editChapter 
                        ? (updateChapterMutation.isPending ? "Updating..." : "Update Chapter")
                        : (createChapterMutation.isPending ? "Creating..." : "Create Chapter")
                      }
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowChapterForm(false);
                        setEditChapter(null);
                        setChapterData({
                          title: "",
                          slug: "",
                          description: "",
                          content: "",
                          categoryId: "",
                          chapterNumber: 1,
                          estimatedMinutes: 5,
                          podcastUrl: "",
                          podcastHeader: "Podcast",
                          videoUrl: "",
                          videoHeader: "Video",
                          contentType: 'lesson',
                          author: "",
                          readingTime: 15,
                          keyTakeaways: [],
                          audioUrl: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Chapters List with Drag-and-Drop */}
          <DragDropContext onDragEnd={handleChapterDragEnd}>
            <Droppable droppableId="chapter-list">
              {(provided) => (
                <div className="space-y-3" ref={provided.innerRef} {...provided.droppableProps}>
                  {chapters.length === 0 ? (
                    <p className="text-[var(--text-secondary)] text-center py-8">
                      No chapters yet. Create your first chapter to get started.
                    </p>
                  ) : (
                    chapters.map((chapter: Chapter, index: number) => (
                      <Draggable key={chapter.id} draggableId={chapter.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-shadow ${snapshot.isDragging ? 'shadow-2xl' : ''}`}
                          >
                            <Card>
                              <CardContent className="p-6 md:p-8 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedChapters.includes(chapter.id)}
                                    onChange={(e) => handleSelectChapter(chapter.id, e.target.checked)}
                                    className="w-5 h-5"
                                  />
                                  <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] text-lg md:text-xl mb-1">{chapter.title}</h3>
                                    <div className="text-base md:text-lg text-[var(--text-secondary)] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: chapter.description }} />
                                    <div className="flex justify-between items-center mt-2 text-sm md:text-base text-[var(--text-secondary)]">
                                      <span>Chapter {chapter.chapterNumber}</span>
                                      <span>{chapter.estimatedMinutes} min</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditChapter(chapter)}>Edit</Button>
                                  <Button size="sm" variant="destructive" onClick={() => setDeleteChapterId(chapter.id)}>Delete</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      {/* Delete Category Dialog */}
      <Dialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)]">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={() => deleteCategoryMutation.mutate(deleteCategoryId!)} className="bg-[var(--accent-yellow)] text-[var(--text-primary)]">Delete</Button>
              <Button variant="ghost" onClick={() => setDeleteCategoryId(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Chapter Dialog */}
      <Dialog open={!!deleteChapterId} onOpenChange={() => setDeleteChapterId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Chapter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)]">Are you sure you want to delete this chapter? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={() => deleteChapterMutation.mutate(deleteChapterId!)} className="bg-[var(--accent-yellow)] text-[var(--text-primary)]">Delete</Button>
              <Button variant="ghost" onClick={() => setDeleteChapterId(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}