/**
 * ---------------------------------------------------------------------------
 * Drizzle + Zod Schema Definitions
 * ---------------------------------------------------------------------------
 *
 * FIX APPLIED: Removed 'originalResolution' from the .omit() list in 
 * insertEnhancementSchema. This ensures that the original resolution, 
 * which is known at the time of file upload, is included in the initial 
 * database insertion request from routes.ts, resolving the TypeScript error.
 */


import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  boolean,
  jsonb,
  index,
  numeric // Import numeric for floating-point metrics
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// --- Drizzle Schema ---

// Session storage table (Unchanged)
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
}, (table) => ({
  expireIdx: index("IDX_session_expire").on(table.expire),
}));

// Users table (Unchanged)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: text("email").unique(),
  hashedPassword: text("hashed_password"), 
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  credits: integer("credits").default(10).notNull(), 
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("free").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Image enhancements - stores all processed images
export const enhancements = pgTable("enhancements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  originalImageUrl: text("original_image_url").notNull(),
  enhancedImageUrl: text("enhanced_image_url"),
  status: text("status").default("pending").notNull(), // pending, processing, completed, failed
  enhancementType: text("enhancement_type").notNull(), 
  modelUsed: text("model_used"), // real-esrgan, gfpgan, etc.
  processingTime: integer("processing_time"), // in milliseconds
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"), // stores additional info like dimensions, settings
  isPublic: boolean("is_public").default(false).notNull(), 
  creditsUsed: integer("credits_used").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // --- AI METRICS AND RESOLUTION FIELDS ---
  processingProgress: integer("processing_progress"), // 0-100%
  psnr: numeric("psnr"), 
  ssim: numeric("ssim"),
  mae: numeric("mae"),
  enhancedResolution: varchar("enhanced_resolution"), // e.g., "1024x1024"
  originalResolution: varchar("original_resolution"), // e.g., "512x512"
});

// Analytics - track system-wide metrics (Unchanged)
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), 
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relations (Unchanged) ---

export const usersRelations = relations(users, ({ many }) => ({
  enhancements: many(enhancements),
}));

export const enhancementsRelations = relations(enhancements, ({ one }) => ({
  user: one(users, {
    fields: [enhancements.userId],
    references: [users.id],
  }),
}));

// --- Zod Schemas for Validation ---

export const upsertUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
});

export const insertEnhancementSchema = createInsertSchema(enhancements).omit({
  id: true, // Database generated
  createdAt: true, // Database generated
  // These fields are set *after* insertion by the worker:
  psnr: true, 
  ssim: true,
  mae: true,
  enhancedResolution: true,
  processingProgress: true, 
  
  // 🟢 FIX APPLIED: originalResolution is NOT omitted because it is
  // known and inserted at the time of creation (in routes.ts).
  // originalResolution: true, // <-- REMOVED THIS LINE
});

// FIX: Updated Zod schema to include all new updateable fields
export const updateEnhancementSchema = z.object({
  enhancedImageUrl: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
  processingTime: z.number().optional(),
  errorMessage: z.string().optional(),
  modelUsed: z.string().optional(), 
  isPublic: z.boolean().optional(),
  creditsUsed: z.number().optional(),
  metadata: z.any().optional(), 
  
  // --- NEW FIELDS ADDED ---
  psnr: z.coerce.number().optional(),
  ssim: z.coerce.number().optional(),
  mae: z.coerce.number().optional(),
  enhancedResolution: z.string().optional(),
  originalResolution: z.string().optional(), 
  processingProgress: z.number().optional(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// --- TypeScript Types ---

export type User = typeof users.$inferSelect;
export type HashedUser = User & { hashedPassword: string }; 
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Enhancement = typeof enhancements.$inferSelect; 
export type InsertEnhancement = z.infer<typeof insertEnhancementSchema>;
export type EnhancementUpdate = z.infer<typeof updateEnhancementSchema>; 
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;