import {
  users,
  categories,
  chapters,
  userProgress,
  sharedChapters,
  chatSessions,
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
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Chapter operations
  getChaptersByCategory(categoryId: number): Promise<Chapter[]>;
  getChapterBySlug(slug: string): Promise<Chapter | undefined>;
  getAllChapters(): Promise<Chapter[]>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getCategoryProgress(userId: string, categoryId: number): Promise<number>;
  
  // Sharing operations
  createSharedChapter(shared: InsertSharedChapter): Promise<SharedChapter>;
  getSharedChapter(shareId: string): Promise<SharedChapter | undefined>;
  
  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(userId: string, messages: any[]): Promise<ChatSession>;
  getUserChatSession(userId: string): Promise<ChatSession | undefined>;
  
  // Analytics operations
  getAnalytics(): Promise<any>;
  
  // Team management operations
  getTeamMembers(): Promise<any[]>;
  getTeamStats(): Promise<any>;
  inviteTeamMember(email: string): Promise<void>;
  removeTeamMember(memberId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getChaptersByCategory(categoryId: number): Promise<Chapter[]> {
    return await db
      .select()
      .from(chapters)
      .where(eq(chapters.categoryId, categoryId))
      .orderBy(asc(chapters.chapterNumber));
  }

  async getChapterBySlug(slug: string): Promise<Chapter | undefined> {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.slug, slug));
    return chapter;
  }

  async getAllChapters(): Promise<Chapter[]> {
    return await db
      .select()
      .from(chapters)
      .orderBy(asc(chapters.categoryId), asc(chapters.chapterNumber));
  }

  async createChapter(chapter: InsertChapter): Promise<Chapter> {
    const [newChapter] = await db
      .insert(chapters)
      .values(chapter)
      .returning();
    return newChapter;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId!),
          eq(userProgress.chapterId, progress.chapterId!)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({
          completed: progress.completed,
          completedAt: progress.completed ? new Date() : null,
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values({
          ...progress,
          completedAt: progress.completed ? new Date() : null,
        })
        .returning();
      return created;
    }
  }

  async getCategoryProgress(userId: string, categoryId: number): Promise<number> {
    const categoryChapters = await this.getChaptersByCategory(categoryId);
    const userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const completedChapters = userProgressData.filter(p => 
      p.completed && categoryChapters.some(c => c.id === p.chapterId)
    );

    return completedChapters.length;
  }

  async createSharedChapter(shared: InsertSharedChapter): Promise<SharedChapter> {
    const [newShared] = await db
      .insert(sharedChapters)
      .values(shared)
      .returning();
    return newShared;
  }

  async getSharedChapter(shareId: string): Promise<SharedChapter | undefined> {
    const [shared] = await db
      .select()
      .from(sharedChapters)
      .where(eq(sharedChapters.shareId, shareId));
    return shared;
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [newSession] = await db
      .insert(chatSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateChatSession(userId: string, messages: any[]): Promise<ChatSession> {
    const existing = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(chatSessions)
        .set({
          messages,
          updatedAt: new Date(),
        })
        .where(eq(chatSessions.id, existing[0].id))
        .returning();
      return updated;
    } else {
      return await this.createChatSession({ userId, messages });
    }
  }

  async getUserChatSession(userId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt))
      .limit(1);
    return session;
  }

  // Analytics operations
  async getAnalytics(): Promise<any> {
    return {
      overallProgress: 68,
      totalUsers: 142,
      activeChats: 89,
      completedChapters: 324,
      averageEngagement: 74,
      weeklyActivity: [
        { day: 'Monday', users: 45, engagement: 72 },
        { day: 'Tuesday', users: 52, engagement: 68 },
        { day: 'Wednesday', users: 48, engagement: 75 },
        { day: 'Thursday', users: 38, engagement: 65 },
        { day: 'Friday', users: 42, engagement: 70 },
        { day: 'Saturday', users: 25, engagement: 58 },
        { day: 'Sunday', users: 28, engagement: 62 }
      ],
      categoryProgress: [
        { category: 'Foundations', progress: 78, users: 89 },
        { category: 'Growing the Team', progress: 65, users: 72 },
        { category: 'Meeting People', progress: 52, users: 58 }
      ],
      topChapters: [
        { title: 'Building Trust', completions: 127, rating: 4.8 },
        { title: 'Effective Communication', completions: 98, rating: 4.6 },
        { title: 'Delegation Strategies', completions: 85, rating: 4.7 }
      ]
    };
  }

  // Team management operations
  async getTeamMembers(): Promise<any[]> {
    return [
      {
        id: '1',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        joinedAt: '2024-01-15T10:00:00Z',
        lastActive: '2024-01-18T14:30:00Z',
        progress: {
          completedChapters: 12,
          totalChapters: 15,
          percentage: 80
        },
        engagement: {
          chatMessages: 45,
          weeklyActivity: 85
        }
      },
      {
        id: '2',
        email: 'jane.smith@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'member',
        joinedAt: '2024-01-10T09:00:00Z',
        lastActive: '2024-01-18T11:15:00Z',
        progress: {
          completedChapters: 8,
          totalChapters: 15,
          percentage: 53
        },
        engagement: {
          chatMessages: 23,
          weeklyActivity: 72
        }
      }
    ];
  }

  async getTeamStats(): Promise<any> {
    return {
      totalMembers: 24,
      activeMembers: 18,
      averageProgress: 67,
      totalChaptersCompleted: 298
    };
  }

  async inviteTeamMember(email: string): Promise<void> {
    // In a real implementation, this would send an email invitation
    console.log(`Invitation sent to ${email}`);
  }

  async removeTeamMember(memberId: string): Promise<void> {
    // In a real implementation, this would remove the member from the team
    console.log(`Member ${memberId} removed from team`);
  }
}

export const storage = new DatabaseStorage();
