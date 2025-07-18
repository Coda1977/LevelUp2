import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  // Add preview mode state
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch categories and chapters
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/chapters"],
  });

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
      categoryId: chapter.categoryId?.toString() || "",
      chapterNumber: chapter.chapterNumber,
      estimatedMinutes: chapter.estimatedMinutes,
      podcastUrl: chapter.podcastUrl || "",
      podcastHeader: chapter.podcastHeader || "Podcast",
      videoUrl: chapter.videoUrl || "",
      videoHeader: chapter.videoHeader || "Video",
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
        <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-4">
          Content Management
        </h1>
        <p className="text-[var(--text-secondary)] text-base md:text-lg">
          Add and manage learning content for Level Up
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Categories</h2>
            <Button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-[var(--accent-yellow)] text-[var(--text-primary)] hover:bg-[var(--accent-yellow)]/80"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
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
              categories.map((category: Category) => (
                <Card key={category.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{category.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{category.description}</p>
                      <div className="text-xs text-[var(--text-secondary)] mt-2">Order: {category.sortOrder}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteCategoryId(category.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Chapters Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Chapters</h2>
            <Button
              onClick={() => setShowChapterForm(!showChapterForm)}
              className="bg-[var(--accent-yellow)] text-[var(--text-primary)] hover:bg-[var(--accent-yellow)]/80"
              disabled={categories.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
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

          {showChapterForm && categories.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editChapter ? 'Edit Chapter' : 'Create New Chapter'}</CardTitle>
                <CardDescription>
                  {editChapter ? 'Update the chapter details and content' : 'Add a new learning chapter with content and media'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateChapter} className="space-y-4">
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
                    <Label htmlFor="chapterContent">Content</Label>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-[var(--text-secondary)]">Edit Mode</span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={previewMode} onChange={e => setPreviewMode(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--accent-yellow)] rounded-full peer peer-checked:bg-[var(--accent-yellow)] transition-all"></div>
                        <span className="ml-2 text-sm text-[var(--text-secondary)]">Preview</span>
                      </label>
                    </div>
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
                      <TiptapEditor
                        value={chapterData.content}
                        onChange={(html) => setChapterData({ ...chapterData, content: html })}
                        placeholder="Main content of the chapter (rich formatting supported)"
                      />
                    )}
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
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {chapters.length === 0 ? (
              <p className="text-[var(--text-secondary)] text-center py-8">
                No chapters yet. Create your first chapter to get started.
              </p>
            ) : (
              chapters.map((chapter: Chapter) => (
                <Card key={chapter.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{chapter.title}</h3>
                      <div className="text-sm text-[var(--text-secondary)] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: chapter.description }} />
                      <div className="flex justify-between items-center mt-2 text-xs text-[var(--text-secondary)]">
                        <span>Chapter {chapter.chapterNumber}</span>
                        <span>{chapter.estimatedMinutes} min</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditChapter(chapter)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteChapterId(chapter.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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
  );
}