import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getChatResponse, getOpenAIChatResponse, getChatResponseStream } from "./openai";
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

  app.post('/api/categories/reorder', isAuthenticated, async (req, res) => {
    try {
      const { order } = req.body; // order: [{id, sortOrder}]
      if (!Array.isArray(order)) return res.status(400).json({ message: 'Invalid order array' });
      for (const { id, sortOrder } of order) {
        await storage.updateCategory(id, { sortOrder });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error reordering categories:', error);
      res.status(500).json({ message: 'Failed to reorder categories' });
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
      const { 
        title, 
        slug, 
        preview, 
        content, 
        categoryId, 
        chapterNumber, 
        duration, 
        youtubeUrl, 
        spotifyUrl,
        // Book summary fields
        contentType,
        author,
        readingTime,
        keyTakeaways,
        audioUrl
      } = req.body;
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
        // Book summary fields
        contentType: contentType || 'lesson',
        author: author || null,
        readingTime: readingTime || null,
        keyTakeaways: keyTakeaways || null,
        audioUrl: audioUrl || null,
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
      const { 
        title, 
        slug, 
        description, 
        content, 
        categoryId, 
        chapterNumber, 
        estimatedMinutes, 
        podcastUrl, 
        podcastHeader, 
        videoUrl, 
        videoHeader,
        // Book summary fields
        contentType,
        author,
        readingTime,
        keyTakeaways,
        audioUrl
      } = req.body;
      
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
        // Book summary fields
        contentType: contentType || 'lesson',
        author: author || null,
        readingTime: readingTime || null,
        keyTakeaways: keyTakeaways || null,
        audioUrl: audioUrl || null,
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

  app.post('/api/chapters/reorder', isAuthenticated, async (req, res) => {
    try {
      const { order } = req.body; // order: [{id, chapterNumber}]
      if (!Array.isArray(order)) return res.status(400).json({ message: 'Invalid order array' });
      for (const { id, chapterNumber } of order) {
        await storage.updateChapter(id, { chapterNumber });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error reordering chapters:', error);
      res.status(500).json({ message: 'Failed to reorder chapters' });
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
  app.get('/api/chat/history/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = req.params.sessionId;
      const session = await storage.getUserChatSession(userId, sessionId);
      res.json(session?.messages || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  app.post('/api/chat/session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = nanoid(12);
      const name = req.body.name || 'New Chat';
      const summary = req.body.summary || '';
      const messages = [];
      const newSession = await storage.createChatSession({
        userId,
        sessionId,
        name,
        summary,
        messages,
      });
      res.json({ id: newSession.sessionId, name: newSession.name, summary: newSession.summary });
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(500).json({ message: 'Failed to create chat session' });
    }
  });

  app.get('/api/chat/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserChatSessions(userId);
      res.json(sessions.map(s => ({ id: s.sessionId, name: s.name, summary: s.summary })));
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      res.status(500).json({ message: 'Failed to fetch chat sessions' });
    }
  });

  app.delete('/api/chat/session/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      await storage.deleteChatSession(userId, sessionId);
      res.json({ message: "Chat session deleted successfully" });
    } catch (error) {
      console.error('Error deleting chat session:', error);
      res.status(500).json({ message: 'Failed to delete chat session' });
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
      const { message, sessionId } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Get all chapters
      const chapters = await storage.getAllChapters();
      const relevantChapters = findRelevantChapters(message, chapters);
      const context = relevantChapters.map(ch => `${ch.title}:\n${ch.content.slice(0, 500)}...`).join('\n\n');
      const references = relevantChapters.map(ch => `[${ch.title}](\/chapter\/${ch.slug})`).join(', ');

      // Build system prompt and user message for OpenAI
      const systemPrompt = `You are the AI Mentor for Level Up, a management development app that transforms leadership learning into bite-sized, actionable insights. Your role is to help managers apply what they learn to real workplace situations with practical, supportive guidance.

## Your Identity

You are a knowledgeable, experienced management coach who is:
- **Supportive but direct** - You provide honest, actionable advice without being preachy
- **Practical-focused** - Every response should help the user take concrete action
- **Framework-oriented** - You use proven management frameworks and reference specific Level Up content
- **Conversational** - Professional but approachable, like talking to a trusted mentor
- **Context-aware** - You remember what users have learned and can connect concepts across chapters

## Response Guidelines

### Structure Your Responses
1. **Lead with practical advice** - Start with what they can do, not theory
2. **Use specific frameworks** - Reference RACI, SBI, Total Motivation factors, etc.
3. **Provide concrete examples** - Give specific scenarios when possible
4. **Include chapter references** - Link to relevant Level Up content
5. **End with a next step** - Always give them something actionable to try

### Tone and Style
- Use **bold text** for key frameworks and important points
- Write in short, scannable paragraphs (2-3 sentences max)
- Ask follow-up questions to understand their specific situation
- Avoid jargon - use simple, clear language
- Be encouraging but realistic about challenges

### When Users Ask About:

**Feedback Issues**: Reference the Feedback chapter, use SBI model, focus on behavior not person
**Delegation Problems**: Use RACI framework, start small and scale up, distinguish between responsible and accountable
**Team Motivation**: Apply Total Motivation factors (Purpose, Potential, Play), ask about what energizes them
**Meeting Challenges**: Reference Having Great Meetings and 1:1s chapters, focus on structure and outcomes
**Leadership Confidence**: Reference Foundations chapters, especially Your Number 1 Role and Growth Mindset

### Response Format Example
\`\`\`
Great question! Based on the [Chapter Name] chapter, here are three key strategies:

**1. [Framework/Concept]:** [Specific explanation]

**2. [Framework/Concept]:** [Specific explanation] 

**3. [Framework/Concept]:** [Specific explanation]

**Quick win:** [One thing they can try this week]

📖 [Relevant Chapter Link]
\`\`\`

## Scenario Practice Mode

When users want to practice scenarios:
1. Set up a realistic workplace situation
2. Ask them what they would do
3. Provide feedback on their approach
4. Suggest improvements using Level Up frameworks
5. Let them try again with your guidance

## Conversation Starters

Be ready to help with common management challenges:
- "How do I give feedback to someone who gets defensive?"
- "I want to delegate more but I'm worried about quality"
- "My team seems disengaged - what should I do?"
- "How can I have more influence without authority?"
- "What should I focus on as a new manager?"

## Remember

- You're not just answering questions - you're developing managers
- Always connect back to Level Up content when relevant
- Focus on what they can control and influence
- Help them see the bigger picture while staying practical
- Be the mentor you wish you had when you were learning to manage

Your goal is to help managers become more confident, effective leaders by applying the practical wisdom from Level Up to their real workplace challenges.

## Available Learning Content:
${context}

${references ? `## Available Chapter References:
${references}` : ''}`;

      const userMessage = message;

      // Get existing chat session
      const session = await storage.getUserChatSession(userId, sessionId);
      const existingMessages = Array.isArray(session?.messages) ? session.messages : [];

      // Add user message
      const messages = [
        ...existingMessages,
        { role: 'user', content: message, timestamp: new Date().toISOString() }
      ];

      // Get AI response (OpenAI)
      const aiResponse = await getOpenAIChatResponse(systemPrompt, userMessage);

      // Add AI response
      const updatedMessages = [
        ...messages,
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
      ];

      // Save to database
      await storage.updateChatSession(userId, sessionId, updatedMessages);

      res.json({ message: aiResponse });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.post('/api/chat/stream', isAuthenticated, async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();
      const { messages, systemPrompt, sessionId } = req.body;
      let aiResponse = '';
      for await (const token of getChatResponseStream(messages, systemPrompt)) {
        aiResponse += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
      // Persist the full AI response to the session's message history
      if (sessionId && Array.isArray(messages)) {
        const userId = req.user.claims.sub;
        const session = await storage.getUserChatSession(userId, sessionId);
        const updatedMessages = [
          ...messages,
          { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
        ];
        if (session) {
          await storage.updateChatSession(userId, sessionId, updatedMessages);
        }
      }
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
      res.end();
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
