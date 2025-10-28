// storage.ts
// =============================================================
// Database Storage Layer (Drizzle ORM for PostgreSQL)
// -------------------------------------------------------------
// Implements the IStorage interface, defining all interactions 
// with the 'users', 'enhancements', and 'analytics' tables.
// This serves as the data access object (DAO) for the API routes.
// =============================================================
// Author: Shruti Mandaokar
// Date: October 2025

import {
  users,
  enhancements,
  analytics,
  type User,
  type UpsertUser,
  type Enhancement,
  type InsertEnhancement,
  type EnhancementUpdate, 
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, count } from "drizzle-orm";
import { randomUUID } from 'crypto'; 

export type InsertUser = {
    email: string;
    hashedPassword: string;
    isAdmin: boolean;
    credits: number;
};

type DrizzleInsertUser = InsertUser & { id: string };


export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>; 
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(userData: InsertUser): Promise<User>; 
  updateUserCredits(id: string, credits: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  createEnhancement(enhancement: InsertEnhancement): Promise<Enhancement>;
  getEnhancement(id: string): Promise<Enhancement | undefined>;
  updateEnhancement(id: string, update: EnhancementUpdate): Promise<Enhancement>;
  getUserEnhancements(userId: string): Promise<Enhancement[]>;
  getPublicEnhancements(): Promise<Enhancement[]>;
  getRecentEnhancements(limit: number): Promise<Enhancement[]>;
  
  logAnalytics(event: InsertAnalytics): Promise<void>;
  getAdminStats(): Promise<{
    totalUsers: number;
    totalEnhancements: number;
    totalCreditsUsed: number;
    revenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (Unchanged)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user as User | undefined; 
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user as User | undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any) 
      .onConflictDoUpdate({
        target: users.id, 
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user as User;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const userToInsert: DrizzleInsertUser = {
      ...userData,
      id: randomUUID(), 
    };
    
    const [user] = await db
      .insert(users)
      .values(userToInsert)
      .returning();
    return user as User; 
  }

  async updateUserCredits(id: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user as User; 
  }

  async getAllUsers(): Promise<User[]> {
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    return result as User[]; 
  }

  // Enhancement operations
  async createEnhancement(enhancement: InsertEnhancement): Promise<Enhancement> {
    const [result] = await db
      .insert(enhancements)
      .values(enhancement)
      .returning();
    return result;
  }

  async getEnhancement(id: string): Promise<Enhancement | undefined> {
    const [enhancement] = await db
      .select()
      .from(enhancements)
      .where(eq(enhancements.id, id));
    return enhancement;
  }

  // FIX: Cast the update object to 'any' to resolve the Drizzle 'numeric' type incompatibility
  async updateEnhancement(id: string, update: EnhancementUpdate): Promise<Enhancement> {
    const [enhancement] = await db
      .update(enhancements)
      .set(update as any) 
      .where(eq(enhancements.id, id))
      .returning();
    return enhancement;
  }
  
  async getUserEnhancements(userId: string): Promise<Enhancement[]> {
    return db
      .select()
      .from(enhancements)
      .where(eq(enhancements.userId, userId))
      .orderBy(desc(enhancements.createdAt));
  }

  async getPublicEnhancements(): Promise<Enhancement[]> {
    return db
      .select()
      .from(enhancements)
      .where(eq(enhancements.isPublic, true))
      .orderBy(desc(enhancements.createdAt))
      .limit(50);
  }

  async getRecentEnhancements(limit: number): Promise<Enhancement[]> {
    return db
      .select()
      .from(enhancements)
      .orderBy(desc(enhancements.createdAt))
      .limit(limit);
  }

  // Analytics operations (Unchanged)
  async logAnalytics(event: InsertAnalytics): Promise<void> {
    await db.insert(analytics).values(event);
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalEnhancements: number;
    totalCreditsUsed: number;
    revenue: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [enhancementCount] = await db.select({ count: count() }).from(enhancements);
    
    const [creditsResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${enhancements.creditsUsed}), 0)` })
      .from(enhancements);

    const paidUsers = await db
      .select()
      .from(users)
      .where(sql`${users.subscriptionTier} != 'free'`);
    
    const revenue = paidUsers.reduce((sum, user) => {
      if (user.subscriptionTier === "pro") return sum + 19;
      if (user.subscriptionTier === "enterprise") return sum + 99;
      return sum;
    }, 0);

    return {
      totalUsers: userCount.count,
      totalEnhancements: enhancementCount.count,
      totalCreditsUsed: Number(creditsResult.total) || 0,
      revenue,
    };
  }
}

export const storage = new DatabaseStorage();