var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analytics: () => analytics,
  enhancements: () => enhancements,
  enhancementsRelations: () => enhancementsRelations,
  insertAnalyticsSchema: () => insertAnalyticsSchema,
  insertEnhancementSchema: () => insertEnhancementSchema,
  sessions: () => sessions,
  updateEnhancementSchema: () => updateEnhancementSchema,
  upsertUserSchema: () => upsertUserSchema,
  users: () => users,
  usersRelations: () => usersRelations
});
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
  numeric
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull()
}, (table) => ({
  expireIdx: index("IDX_session_expire").on(table.expire)
}));
var users = pgTable("users", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var enhancements = pgTable("enhancements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  originalImageUrl: text("original_image_url").notNull(),
  enhancedImageUrl: text("enhanced_image_url"),
  status: text("status").default("pending").notNull(),
  // pending, processing, completed, failed
  enhancementType: text("enhancement_type").notNull(),
  modelUsed: text("model_used"),
  // real-esrgan, gfpgan, etc.
  processingTime: integer("processing_time"),
  // in milliseconds
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
  // stores additional info like dimensions, settings
  isPublic: boolean("is_public").default(false).notNull(),
  creditsUsed: integer("credits_used").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // --- AI METRICS AND RESOLUTION FIELDS ---
  processingProgress: integer("processing_progress"),
  // 0-100%
  psnr: numeric("psnr"),
  ssim: numeric("ssim"),
  mae: numeric("mae"),
  enhancedResolution: varchar("enhanced_resolution"),
  // e.g., "1024x1024"
  originalResolution: varchar("original_resolution")
  // e.g., "512x512"
});
var analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var usersRelations = relations(users, ({ many }) => ({
  enhancements: many(enhancements)
}));
var enhancementsRelations = relations(enhancements, ({ one }) => ({
  user: one(users, {
    fields: [enhancements.userId],
    references: [users.id]
  })
}));
var upsertUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional()
});
var insertEnhancementSchema = createInsertSchema(enhancements).omit({
  id: true,
  // Database generated
  createdAt: true,
  // Database generated
  // These fields are set *after* insertion by the worker:
  psnr: true,
  ssim: true,
  mae: true,
  enhancedResolution: true,
  processingProgress: true
  // 🟢 FIX APPLIED: originalResolution is NOT omitted because it is
  // known and inserted at the time of creation (in routes.ts).
  // originalResolution: true, // <-- REMOVED THIS LINE
});
var updateEnhancementSchema = z.object({
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
  processingProgress: z.number().optional()
});
var insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2, count } from "drizzle-orm";
import { randomUUID } from "crypto";
var DatabaseStorage = class {
  // User operations (Unchanged)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async createUser(userData) {
    const userToInsert = {
      ...userData,
      id: randomUUID()
    };
    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }
  async updateUserCredits(id, credits) {
    const [user] = await db.update(users).set({ credits, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user;
  }
  async getAllUsers() {
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    return result;
  }
  // Enhancement operations
  async createEnhancement(enhancement) {
    const [result] = await db.insert(enhancements).values(enhancement).returning();
    return result;
  }
  async getEnhancement(id) {
    const [enhancement] = await db.select().from(enhancements).where(eq(enhancements.id, id));
    return enhancement;
  }
  // FIX: Cast the update object to 'any' to resolve the Drizzle 'numeric' type incompatibility
  async updateEnhancement(id, update) {
    const [enhancement] = await db.update(enhancements).set(update).where(eq(enhancements.id, id)).returning();
    return enhancement;
  }
  async getUserEnhancements(userId) {
    return db.select().from(enhancements).where(eq(enhancements.userId, userId)).orderBy(desc(enhancements.createdAt));
  }
  async getPublicEnhancements() {
    return db.select().from(enhancements).where(eq(enhancements.isPublic, true)).orderBy(desc(enhancements.createdAt)).limit(50);
  }
  async getRecentEnhancements(limit) {
    return db.select().from(enhancements).orderBy(desc(enhancements.createdAt)).limit(limit);
  }
  // Analytics operations (Unchanged)
  async logAnalytics(event) {
    await db.insert(analytics).values(event);
  }
  async getAdminStats() {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [enhancementCount] = await db.select({ count: count() }).from(enhancements);
    const [creditsResult] = await db.select({ total: sql2`COALESCE(SUM(${enhancements.creditsUsed}), 0)` }).from(enhancements);
    const paidUsers = await db.select().from(users).where(sql2`${users.subscriptionTier} != 'free'`);
    const revenue = paidUsers.reduce((sum, user) => {
      if (user.subscriptionTier === "pro") return sum + 19;
      if (user.subscriptionTier === "enterprise") return sum + 99;
      return sum;
    }, 0);
    return {
      totalUsers: userCount.count,
      totalEnhancements: enhancementCount.count,
      totalCreditsUsed: Number(creditsResult.total) || 0,
      revenue
    };
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import multer from "multer";
import axios from "axios";
import cookie_parser from "cookie-parser";
import sharp from "sharp";

// server/authUtils.tsx
import pkg from "jsonwebtoken";
import { hash, compare } from "bcrypt";
var { sign, verify } = pkg;
var JWT_SECRET = process.env.JWT_SECRET || "a_very_strong_default_secret_for_dev";
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hashValue) {
  return compare(password, hashValue);
}
function generateToken(payload) {
  return sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
function verifyToken(token) {
  try {
    const decoded = verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return "Invalid or expired token";
  }
}

// server/routes.ts
import { ZodError } from "zod";
var PYTHON_WORKER_URL = "http://localhost:5000/api/enhancements/process_job";
var ENHANCEMENT_COST = 1;
async function readImageResolutionFromBuffer(buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    if (metadata.width && metadata.height) {
      return `${metadata.width}x${metadata.height}`;
    }
    throw new Error("Missing image dimensions.");
  } catch (error) {
    console.error("Error reading image metadata:", error);
    return "N/A";
  }
}
function authenticate(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    req.user = null;
    return next();
  }
  const verificationResult = verifyToken(token);
  if (typeof verificationResult === "string" || !verificationResult) {
    res.clearCookie("jwt");
    req.user = null;
    return next();
  }
  req.user = verificationResult;
  next();
}
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required." });
  }
  next();
}
async function queueEnhancementJob(enhancementId, userId, imageBase64, enhancementType, scale, startTime) {
  try {
    await storage.updateEnhancement(enhancementId, {
      status: "processing",
      processingProgress: 10
    });
    console.log(`[JOB START] Enhancement ${enhancementId} is processing.`);
    const response = await axios.post(PYTHON_WORKER_URL, {
      jobId: enhancementId,
      enhancementType,
      imageFileBase64: imageBase64
    });
    if (response.status !== 202) {
      throw new Error(`Python worker rejected job with status: ${response.status}`);
    }
    console.log(`[JOB DELEGATED] Enhancement ${enhancementId} successfully sent to Python worker.`);
  } catch (error) {
    const failureTime = Date.now() - startTime;
    console.error(`[JOB FAILED] Enhancement ${enhancementId} failed to delegate or start:`, error);
    await storage.updateEnhancement(enhancementId, {
      status: "failed",
      errorMessage: error.message || "Failed to delegate job to local worker.",
      processingTime: failureTime
    });
    const currentUser = await storage.getUser(userId);
    if (currentUser) {
      await storage.updateUserCredits(userId, currentUser.credits + ENHANCEMENT_COST);
      console.log(`Credits refunded to user ${userId} due to delegation failure.`);
    }
  }
}
async function registerRoutes(app2) {
  app2.use(cookie_parser());
  app2.use(authenticate);
  const upload = multer({ storage: multer.memoryStorage() });
  app2.post("/api/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    try {
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) return res.status(409).json({ message: "A user with that email already exists." });
      const hashedPassword = await hashPassword(password);
      const newUser = await storage.createUser({
        email,
        hashedPassword,
        isAdmin: false,
        credits: 50
      });
      const token = generateToken({ id: newUser.id, isAdmin: newUser.isAdmin });
      res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      const userResponse = { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin, credits: newUser.credits };
      return res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ message: "Invalid data format." });
      console.error(error);
      return res.status(500).json({ message: "Internal server error during signup." });
    }
  });
  app2.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !await comparePassword(password, user.hashedPassword)) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      const token = generateToken({ id: user.id, isAdmin: user.isAdmin });
      res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      const userResponse = { id: user.id, email: user.email, isAdmin: user.isAdmin, credits: user.credits };
      return res.status(200).json(userResponse);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error during login." });
    }
  });
  app2.post("/api/logout", (req, res) => {
    res.clearCookie("jwt");
    req.user = null;
    res.status(200).json({ message: "Logged out successfully." });
  });
  app2.get("/api/session", async (req, res) => {
    if (req.user && req.user.id) {
      const fullUser = await storage.getUser(req.user.id);
      if (fullUser) {
        const userResponse = { id: fullUser.id, email: fullUser.email, isAdmin: fullUser.isAdmin, credits: fullUser.credits };
        return res.status(200).json({ isAuthenticated: true, user: userResponse });
      }
    }
    return res.status(200).json({ isAuthenticated: false, user: null });
  });
  app2.post("/api/enhancements/upload", requireAuth, upload.single("image"), async (req, res) => {
    const userId = req.user.id;
    const enhancementType = req.body.enhancementType;
    const scale = 2;
    const startTime = Date.now();
    if (!req.file || !enhancementType) {
      return res.status(400).json({ message: "Missing image file or enhancement type." });
    }
    let user;
    let enhancementId;
    try {
      user = await storage.getUser(userId);
      if (!user || user.credits < ENHANCEMENT_COST) {
        return res.status(402).json({ message: "Insufficient credits." });
      }
      await storage.updateUserCredits(userId, user.credits - ENHANCEMENT_COST);
      const originalResolution = await readImageResolutionFromBuffer(req.file.buffer);
      const imageBase64 = req.file.buffer.toString("base64");
      const imageMime = req.file.mimetype;
      const originalImageUrl = `data:${imageMime};base64,${imageBase64}`;
      const pendingEnhancement = await storage.createEnhancement({
        userId,
        status: "pending",
        originalImageUrl,
        enhancementType,
        metadata: { enhancementType, scale },
        creditsUsed: ENHANCEMENT_COST,
        // 🟢 ADD ORIGINAL RESOLUTION TO DB RECORD
        originalResolution
      });
      enhancementId = pendingEnhancement.id;
      console.log(`[DB SUCCESS] Created enhancement ID: ${enhancementId}. Status: pending. Original Resolution: ${originalResolution}`);
      Promise.resolve(queueEnhancementJob(enhancementId, userId, imageBase64, enhancementType, scale, startTime));
      return res.status(202).json({
        message: "Enhancement job created.",
        enhancementId,
        creditsRemaining: user.credits - ENHANCEMENT_COST
      });
    } catch (error) {
      console.error("[CRITICAL UPLOAD ERROR]: Failed to create DB record or queue job:", error);
      if (user) {
        const currentCredits = (await storage.getUser(userId))?.credits || 0;
        if (currentCredits < user.credits) {
          await storage.updateUserCredits(userId, user.credits);
          console.log(`Credits refunded due to pre-job failure for user ${userId}`);
        }
      }
      return res.status(500).json({ message: "Failed to start enhancement job." });
    }
  });
  app2.get("/api/enhancements", requireAuth, async (req, res) => {
    const userId = req.user.id;
    try {
      const enhancements2 = await storage.getUserEnhancements(userId);
      return res.status(200).json(enhancements2);
    } catch (error) {
      console.error("Failed to fetch enhancements:", error);
      return res.status(500).json({ message: "Failed to fetch enhancement history." });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // Enables React Fast Refresh & JSX support
    runtimeErrorOverlay(),
    // Shows runtime errors in a modal overlay
    // Only load Replit dev plugins in development mode
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
        // Maps file changes in Replit IDE
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
        // Shows a dev banner for Replit users
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      // src alias
      "@shared": path.resolve(import.meta.dirname, "shared"),
      // shared code
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
      // asset imports
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  // Project root for Vite
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    // Build output directory
    emptyOutDir: true
    // Clears the output folder before each build
  },
  server: {
    fs: {
      strict: true,
      // Restrict access to files outside root
      deny: ["**/.*"]
      // Deny hidden files access
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(this, [bodyJson]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const logBody = { ...capturedJsonResponse };
        logLine += ` :: ${JSON.stringify(logBody)}`;
      }
      log(logLine);
    }
  });
  next();
});
var isDevelopment = process.env.NODE_ENV !== "production";
(async () => {
  const server = await registerRoutes(app);
  if (isDevelopment) {
    console.log("\u{1F7E1} Running in Development Mode: Setting up Vite HMR.");
    await setupVite(app, server);
  } else {
    console.log("\u{1F7E2} Running in Production Mode: Serving static client assets.");
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5001", 10);
  const host = process.env.HOST || "0.0.0.0";
  server.listen(port, () => {
    console.log(`

\u2705 Server is serving on http://localhost:${port}`);
    console.log(`\u2705 Client assets are served from /`);
  });
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server.");
    server.close(() => {
      process.exit(0);
    });
  });
})();
