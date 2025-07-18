import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getChatResponse } from "./anthropic";
import { z } from "zod";
import { nanoid } from "nanoid";

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

  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get existing chat session
      const session = await storage.getUserChatSession(userId);
      const existingMessages = Array.isArray(session?.messages) ? session.messages : [];

      // Add user message
      const messages = [
        ...existingMessages,
        { role: 'user', content: message, timestamp: new Date().toISOString() }
      ];

      // Get AI response
      const aiResponse = await getChatResponse(
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      // Add AI response
      const updatedMessages = [
        ...messages,
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
      ];

      // Save to database
      await storage.updateChatSession(userId, updatedMessages);

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
