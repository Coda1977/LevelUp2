import { type IStorage } from "./storage";
import {
  type User,
  type UpsertUser,
  type Category,
  type Chapter,
  type UserProgress,
  type SharedChapter,
  type ChatSession,
  type InsertCategory,
  type InsertChapter,
  type InsertUserProgress,
  type InsertSharedChapter,
  type InsertChatSession,
} from "@shared/schema";

export class MockStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private chapters: Map<number, Chapter> = new Map();
  private userProgress: Map<string, UserProgress[]> = new Map();
  private sharedChapters: Map<string, SharedChapter> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private nextId = 1;

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData() {
    // Add test categories
    const categories = [
      { id: 1, slug: "foundations", title: "Foundations", description: "Core management principles", sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, slug: "growing-team", title: "Growing the Team", description: "Team development and growth", sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, slug: "meeting-people", title: "Meeting People", description: "Communication and networking", sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
    ];
    
    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Add test chapters
    const chapters = [
      {
        id: 1,
        categoryId: 1,
        title: "The Manager's Dilemma",
        slug: "managers-dilemma",
        description: "Understanding the transition from individual contributor to manager",
        content: "Being a manager means navigating the complex world of leading people while delivering results...",
        chapterNumber: 1,
        estimatedMinutes: 5,
        duration: "5 min",
        podcastUrl: null,
        podcastHeader: "Podcast",
        videoUrl: null,
        videoHeader: "Video",
        contentType: "lesson",
        author: null,
        readingTime: null,
        keyTakeaways: null,
        audioUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        categoryId: 1,
        title: "Building Trust",
        slug: "building-trust",
        description: "Establishing credibility and trust with your team",
        content: "Trust is the foundation of effective leadership. It's built through consistency, transparency, and reliability...",
        chapterNumber: 2,
        estimatedMinutes: 5,
        duration: "5 min",
        podcastUrl: null,
        podcastHeader: "Podcast",
        videoUrl: null,
        videoHeader: "Video",
        contentType: "lesson",
        author: null,
        readingTime: null,
        keyTakeaways: null,
        audioUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        categoryId: 2,
        title: "Effective Delegation",
        slug: "effective-delegation",
        description: "Learning to delegate tasks and responsibilities effectively",
        content: "Delegation is not just about assigning tasks—it's about developing your team and multiplying your impact...",
        chapterNumber: 1,
        estimatedMinutes: 5,
        duration: "5 min",
        podcastUrl: null,
        podcastHeader: "Podcast",
        videoUrl: null,
        videoHeader: "Video",
        contentType: "lesson",
        author: null,
        readingTime: null,
        keyTakeaways: null,
        audioUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    chapters.forEach(chapter => this.chapters.set(chapter.id, chapter));
    this.nextId = 4;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) throw new Error('Category not found');
    
    const updated: Category = {
      ...existing,
      ...categoryData,
      updatedAt: new Date(),
    };
    this.categories.set(id, updated);
    return updated;
  }

  async getChaptersByCategory(categoryId: number): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .filter(chapter => chapter.categoryId === categoryId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  async getChapterBySlug(slug: string): Promise<Chapter | undefined> {
    return Array.from(this.chapters.values()).find(chapter => chapter.slug === slug);
  }

  async getChapterById(id: number): Promise<Chapter | null> {
    return this.chapters.get(id) || null;
  }

  async getAllChapters(): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .sort((a, b) => a.categoryId - b.categoryId || a.chapterNumber - b.chapterNumber);
  }

  async createChapter(chapter: InsertChapter): Promise<Chapter> {
    const newChapter: Chapter = {
      ...chapter,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chapters.set(newChapter.id, newChapter);
    return newChapter;
  }

  async updateChapter(id: number, chapterData: Partial<InsertChapter>): Promise<Chapter> {
    const existing = this.chapters.get(id);
    if (!existing) throw new Error('Chapter not found');
    
    const updated: Chapter = {
      ...existing,
      ...chapterData,
      updatedAt: new Date(),
    };
    this.chapters.set(id, updated);
    return updated;
  }

  async deleteChapter(id: number): Promise<void> {
    this.chapters.delete(id);
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return this.userProgress.get(userId) || [];
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const userProgressArray = this.userProgress.get(progress.userId) || [];
    const existingIndex = userProgressArray.findIndex(
      p => p.userId === progress.userId && p.chapterId === progress.chapterId
    );

    const newProgress: UserProgress = {
      ...progress,
      id: existingIndex >= 0 ? userProgressArray[existingIndex].id : this.nextId++,
      completedAt: progress.completed ? new Date() : null,
      createdAt: existingIndex >= 0 ? userProgressArray[existingIndex].createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      userProgressArray[existingIndex] = newProgress;
    } else {
      userProgressArray.push(newProgress);
    }

    this.userProgress.set(progress.userId, userProgressArray);
    return newProgress;
  }

  async getCategoryProgress(userId: string, categoryId: number): Promise<number> {
    const userProgressArray = this.userProgress.get(userId) || [];
    const categoryChapters = Array.from(this.chapters.values())
      .filter(chapter => chapter.categoryId === categoryId);
    
    const completedChapters = userProgressArray.filter(
      p => p.completed && categoryChapters.some(ch => ch.id === p.chapterId)
    );

    return completedChapters.length;
  }

  async createSharedChapter(shared: InsertSharedChapter): Promise<SharedChapter> {
    const newShared: SharedChapter = {
      ...shared,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sharedChapters.set(shared.shareId, newShared);
    return newShared;
  }

  async getSharedChapter(shareId: string): Promise<SharedChapter | undefined> {
    return this.sharedChapters.get(shareId);
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const newSession: ChatSession = {
      ...session,
      id: this.nextId++,
      summary: session.summary || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const key = `${session.userId}:${session.sessionId}`;
    this.chatSessions.set(key, newSession);
    return newSession;
  }

  async updateChatSession(userId: string, sessionId: string, messages: any[]): Promise<ChatSession> {
    const key = `${userId}:${sessionId}`;
    let session = this.chatSessions.get(key);
    
    if (!session) {
      return await this.createChatSession({
        userId,
        sessionId,
        name: "Chat Session",
        summary: '',
        messages,
      });
    }

    session = {
      ...session,
      messages,
      updatedAt: new Date(),
    };
    this.chatSessions.set(key, session);
    return session;
  }

  async updateChatSessionName(userId: string, sessionId: string, name: string): Promise<void> {
    const key = `${userId}:${sessionId}`;
    const session = this.chatSessions.get(key);
    if (session) {
      this.chatSessions.set(key, {
        ...session,
        name,
        updatedAt: new Date(),
      });
    }
  }

  async getUserChatSession(userId: string, sessionId: string): Promise<ChatSession | undefined> {
    const key = `${userId}:${sessionId}`;
    return this.chatSessions.get(key);
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId);
  }

  async deleteChatSession(userId: string, sessionId: string): Promise<void> {
    const key = `${userId}:${sessionId}`;
    this.chatSessions.delete(key);
  }

  async getAnalytics(): Promise<any> {
    return {
      overallProgress: 45,
      totalUsers: this.users.size,
      activeChats: this.chatSessions.size,
      completedChapters: Array.from(this.userProgress.values())
        .flat()
        .filter(p => p.completed).length,
      averageEngagement: 78,
      weeklyActivity: [
        { day: "Mon", activity: 12 },
        { day: "Tue", activity: 8 },
        { day: "Wed", activity: 15 },
        { day: "Thu", activity: 10 },
        { day: "Fri", activity: 18 },
        { day: "Sat", activity: 5 },
        { day: "Sun", activity: 3 },
      ],
      categoryProgress: Array.from(this.categories.values()).map(cat => ({
        category: cat.title,
        progress: Math.floor(Math.random() * 100)
      })),
      topChapters: Array.from(this.chapters.values()).slice(0, 3).map(ch => ({
        title: ch.title,
        completions: Math.floor(Math.random() * 50)
      }))
    };
  }

  async getContentAnalytics(): Promise<any> {
    const chapters = Array.from(this.chapters.values());
    return {
      chapterStats: chapters.map(ch => ({
        chapterId: ch.id,
        title: ch.title,
        categoryTitle: this.categories.get(ch.categoryId)?.title || "Unknown",
        completions: Math.floor(Math.random() * 20),
        started: Math.floor(Math.random() * 30) + 20,
        completionRate: Math.floor(Math.random() * 100),
        avgCompletionTime: Math.floor(Math.random() * 10) + 5,
        lastCompleted: new Date()
      })),
      categoryStats: Array.from(this.categories.values()).map(cat => ({
        categoryId: cat.id,
        categoryTitle: cat.title,
        totalChapters: chapters.filter(ch => ch.categoryId === cat.id).length,
        totalCompletions: Math.floor(Math.random() * 50),
        totalUsers: Math.floor(Math.random() * 20),
        avgCompletionRate: Math.floor(Math.random() * 100)
      })),
      trendingChapters: chapters.slice(0, 3).map(ch => ({
        chapterId: ch.id,
        title: ch.title,
        categoryTitle: this.categories.get(ch.categoryId)?.title || "Unknown",
        recentCompletions: Math.floor(Math.random() * 10),
        trend: "up"
      })),
      userEngagement: {
        totalUsers: this.users.size,
        activeUsers: Math.floor(this.users.size * 0.7),
        avgChaptersPerUser: 3.2,
        completionRate: 68
      },
      summary: {
        mostPopularChapter: { title: chapters[0]?.title, completions: 25 },
        leastEngagedChapters: chapters.slice(-2).map(ch => ({ title: ch.title, completions: 2 })),
        totalEngagement: 150
      }
    };
  }

  async getTeamMembers(): Promise<any[]> {
    return Array.from(this.users.values()).map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'member',
      joinedAt: user.createdAt,
      lastActive: user.updatedAt,
      progress: {
        completedChapters: Math.floor(Math.random() * 10),
        totalChapters: this.chapters.size,
        percentage: Math.floor(Math.random() * 100)
      },
      engagement: {
        chatMessages: Math.floor(Math.random() * 50),
        weeklyActivity: Math.floor(Math.random() * 20)
      }
    }));
  }

  async getTeamStats(): Promise<any> {
    return {
      totalMembers: this.users.size,
      activeMembers: Math.floor(this.users.size * 0.8),
      averageProgress: 65,
      totalChaptersCompleted: Math.floor(Math.random() * 100)
    };
  }

  async inviteTeamMember(email: string): Promise<void> {
    console.log(`Mock: Invitation sent to ${email}`);
  }

  async removeTeamMember(memberId: string): Promise<void> {
    console.log(`Mock: Member ${memberId} removed from team`);
  }
}

export const mockStorage = new MockStorage();