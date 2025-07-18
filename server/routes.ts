import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getChatResponse } from "./anthropic";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getOpenAIChatResponse } from "./openai"; // (Assume this will be implemented)

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const { title, description, sortOrder } = req.body;
      // Generate slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      const category = await storage.createCategory({
        slug,
        title,
        description,
        sortOrder: sortOrder || 1,
      });
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Chapters routes
  app.get('/api/chapters', async (req, res) => {
    try {
      const chapters = await storage.getAllChapters();
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  app.get('/api/chapters/:slug', async (req, res) => {
    try {
      const chapter = await storage.getChapterBySlug(req.params.slug);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      res.status(500).json({ message: "Failed to fetch chapter" });
    }
  });

  app.post('/api/chapters', isAuthenticated, async (req, res) => {
    try {
      const { title, slug, preview, content, categoryId, chapterNumber, duration, youtubeUrl, spotifyUrl } = req.body;
      // Generate slug from title if not provided
      const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      const chapter = await storage.createChapter({
        title,
        slug: finalSlug,
        preview,
        content,
        categoryId,
        chapterNumber: chapterNumber || 1,
        duration: duration || "5 min",
        youtubeUrl: youtubeUrl || null,
        spotifyUrl: spotifyUrl || null,
      });
      res.json(chapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      res.status(500).json({ message: "Failed to create chapter" });
    }
  });

  app.put('/api/chapters/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, slug, description, content, categoryId, chapterNumber, estimatedMinutes, podcastUrl, podcastHeader, videoUrl, videoHeader } = req.body;
      
      const chapter = await storage.updateChapter(id, {
        title,
        slug,
        description,
        content,
        categoryId,
        chapterNumber,
        estimatedMinutes,
        podcastUrl: podcastUrl || null,
        podcastHeader: podcastHeader || "Podcast",
        videoUrl: videoUrl || null,
        videoHeader: videoHeader || "Video",
      });
      res.json(chapter);
    } catch (error) {
      console.error("Error updating chapter:", error);
      res.status(500).json({ message: "Failed to update chapter" });
    }
  });

  app.delete('/api/chapters/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteChapter(id);
      res.json({ message: "Chapter deleted successfully" });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      res.status(500).json({ message: "Failed to delete chapter" });
    }
  });

  // Progress routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress/:chapterId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chapterId = parseInt(req.params.chapterId);
      const { completed } = req.body;

      const progress = await storage.updateUserProgress({
        userId,
        chapterId,
        completed: Boolean(completed),
      });

      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Category progress routes
  app.get('/api/categories/:categoryId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const categoryId = parseInt(req.params.categoryId);
      const progress = await storage.getCategoryProgress(userId, categoryId);
      res.json({ progress });
    } catch (error) {
      console.error("Error fetching category progress:", error);
      res.status(500).json({ message: "Failed to fetch category progress" });
    }
  });

  // Sharing routes
  app.post('/api/chapters/:chapterId/share', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chapterId = parseInt(req.params.chapterId);
      const shareId = nanoid(12);
      const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days

      const shared = await storage.createSharedChapter({
        shareId,
        chapterId,
        sharedBy: userId,
        expiresAt,
      });

      res.json({ shareId, expiresAt });
    } catch (error) {
      console.error("Error creating share:", error);
      res.status(500).json({ message: "Failed to create share" });
    }
  });

  app.get('/api/shared/:shareId', async (req, res) => {
    try {
      const shared = await storage.getSharedChapter(req.params.shareId);
      if (!shared || new Date() > shared.expiresAt) {
        return res.status(404).json({ message: "Shared chapter not found or expired" });
      }

      const chapter = await storage.getChapterBySlug(shared.chapterId?.toString() || '');
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      res.json({ chapter, shared });
    } catch (error) {
      console.error("Error fetching shared chapter:", error);
      res.status(500).json({ message: "Failed to fetch shared chapter" });
    }
  });

  // Chat routes
  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const session = await storage.getUserChatSession(userId);
      res.json(session?.messages || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Helper: Find relevant chapters by keyword match
  function findRelevantChapters(query: string, chapters: any[]) {
    const q = query.toLowerCase();
    return chapters
      .map(ch => ({
        ...ch,
        score: (ch.title + ' ' + ch.content).toLowerCase().includes(q) ? 1 : 0
      }))
      .filter(ch => ch.score > 0)
      .slice(0, 2); // top 2 matches
  }

  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get all chapters
      const chapters = await storage.getAllChapters();
      const relevantChapters = findRelevantChapters(message, chapters);
      const context = relevantChapters.map(ch => `${ch.title}:\n${ch.content.slice(0, 500)}...`).join('\n\n');
      const references = relevantChapters.map(ch => `[${ch.title}](\/chapter\/${ch.slug})`).join(', ');

      // Build prompt for OpenAI
      const prompt = `You are a management coach. Here is some learning content:\n${context}\n\nUser question: ${message}\n\nInstructions:\n- Answer the user's question based on the above content.\n- Do NOT copy the content verbatim.\n- At the end, add a reference link to the relevant chapter(s) in this format: ${references}`;

      // Get AI response (OpenAI)
      const aiResponse = await getOpenAIChatResponse(prompt);

      // Save to chat history as before (optional, not shown here)

      res.json({ message: aiResponse });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Team management routes
  app.get('/api/team/members', isAuthenticated, async (req: any, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get('/api/team/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getTeamStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching team stats:", error);
      res.status(500).json({ message: "Failed to fetch team stats" });
    }
  });

  app.post('/api/team/invite', isAuthenticated, async (req: any, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }

      await storage.inviteTeamMember(email);
      res.json({ message: "Invitation sent successfully" });
    } catch (error) {
      console.error("Error inviting team member:", error);
      res.status(500).json({ message: "Failed to send invitation" });
    }
  });

  app.delete('/api/team/members/:memberId', isAuthenticated, async (req: any, res) => {
    try {
      const { memberId } = req.params;
      await storage.removeTeamMember(memberId);
      res.json({ message: "Member removed successfully" });
    } catch (error) {
      console.error("Error removing team member:", error);
      res.status(500).json({ message: "Failed to remove member" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
