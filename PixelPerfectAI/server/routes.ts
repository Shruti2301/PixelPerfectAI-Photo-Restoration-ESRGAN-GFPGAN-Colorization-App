// server/routes.ts
// =============================================================
// API Router and Core Business Logic (Node.js/Express)
// -------------------------------------------------------------

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // Database storage layer
import multer from "multer"; // Middleware for handling file uploads
import axios from "axios"; 
import cookie_parser from "cookie-parser"; 
import sharp from 'sharp'; 

import { hashPassword, comparePassword, generateToken, verifyToken } from "./authUtils";
import type { User, EnhancementUpdate } from "@shared/schema"; 
import { ZodError } from "zod"; 

// --- Configuration ---
interface HashedUser extends User {
    hashedPassword: string;
}

interface NewUserCreationData {
    email: string;
    hashedPassword: string;
    isAdmin: boolean;
    credits: number;
}

const LOCAL_SERVER_URL = `http://127.0.0.1:${process.env.PORT || 5001}`; 
const PYTHON_WORKER_URL = 'http://localhost:5000/api/enhancements/process_job'; 
const ENHANCEMENT_COST = 1; 


// LOCAL FUNCTION: Read Image Resolution using Sharp
async function readImageResolutionFromBuffer(buffer: Buffer): Promise<string> {
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

// --- Middleware ---
export function authenticate(req: Request, res: Response, next: any) {
    const token = req.cookies.jwt; 
    
    if (!token) {
        req.user = null; 
        return next();
    }

    const verificationResult = verifyToken(token);

    if (typeof verificationResult === 'string' || !verificationResult) {
        res.clearCookie('jwt');
        req.user = null; 
        return next();
    }

    req.user = verificationResult; 
    next();
}

function requireAuth(req: Request, res: Response, next: any) {
    if (!req.user || !req.user.id) { 
        return res.status(401).json({ message: "Authentication required." });
        
    }
    next();
}

// =========================================================================
// ASYNCHRONOUS JOB HANDLER
// =========================================================================
async function queueEnhancementJob(
    enhancementId: string, 
    userId: string, 
    imageBase64: string, 
    enhancementType: string, 
    scale: number, 
    startTime: number 
) {
    
    try {
        await storage.updateEnhancement(enhancementId, {
            status: "processing", 
            processingProgress: 10,
        } as unknown as EnhancementUpdate); 
        console.log(`[JOB DELEGATE] Enhancement ${enhancementId} is processing.`);
        
        const response = await axios.post(PYTHON_WORKER_URL, {
            jobId: enhancementId, 
            enhancementType: enhancementType,
            imageFileBase64: imageBase64, 
            callbackUrl: `${LOCAL_SERVER_URL}/api/enhancements/complete`, 
        });

        if (response.status !== 202) {
             throw new Error(`Python worker rejected job with status: ${response.status}`);
        }

        console.log(`[JOB SENT] Enhancement ${enhancementId} successfully delegated to Python worker.`);
        
    } catch (error: any) {
        const failureTime = Date.now() - startTime;
        console.error(`[JOB FAILED] Enhancement ${enhancementId} failed to delegate or start:`, error);
        
        await storage.updateEnhancement(enhancementId, {
            status: "failed",
            errorMessage: error.message || "Failed to delegate job to local worker.",
            processingTime: failureTime,
        } as unknown as EnhancementUpdate); 
        
        const currentUser = await storage.getUser(userId);
        if (currentUser) {
            await storage.updateUserCredits(userId, currentUser.credits + ENHANCEMENT_COST);
            console.log(`Credits refunded to user ${userId} due to delegation failure.`);
        }
    }
}
// =========================================================================


// --- API Routes Initialization ---
export async function registerRoutes(app: Express): Promise<Server> {

    app.use(cookie_parser());
    app.use(authenticate);

    const upload = multer({ storage: multer.memoryStorage() });

    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION ROUTES 
    // -------------------------------------------------------------------------

    app.post("/api/signup", async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

        try {
            const existingUser = await storage.getUserByEmail(email) as HashedUser | undefined; 
            if (existingUser) return res.status(409).json({ message: "A user with that email already exists." }); 

            const hashedPassword = await hashPassword(password);
            
            const newUser = await storage.createUser({
                email,
                hashedPassword,
                isAdmin: false,
                credits: 50,
            } as unknown as NewUserCreationData) as User; 

            const token = generateToken({ id: newUser.id, isAdmin: newUser.isAdmin });
            res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

            const userResponse: Partial<User> = { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin, credits: newUser.credits, firstName: newUser.firstName };
            return res.status(201).json(userResponse); 

        } catch (error) {
            if (error instanceof ZodError) return res.status(400).json({ message: "Invalid data format." });
            console.error(error);
            return res.status(500).json({ message: "Internal server error during signup." });
        }
    });

    app.post("/api/login", async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

        try {
            const user = await storage.getUserByEmail(email) as HashedUser | undefined;
            
            if (!user || !(await comparePassword(password, user.hashedPassword))) { 
                return res.status(401).json({ message: "Invalid email or password." }); 
            }

            const token = generateToken({ id: user.id, isAdmin: user.isAdmin });
            res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

            const userResponse: Partial<User> = { id: user.id, email: user.email, isAdmin: user.isAdmin, credits: user.credits, firstName: user.firstName };
            return res.status(200).json(userResponse); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error during login." });
        }
    });

    app.post("/api/logout", (req: Request, res: Response) => {
        res.clearCookie('jwt');
        req.user = null; 
        res.status(200).json({ message: "Logged out successfully." });
    });

    app.get("/api/session", async (req: Request, res: Response) => {
        if (req.user && req.user.id) { 
            const fullUser = await storage.getUser(req.user.id);

            if (fullUser) {
                 const userResponse: Partial<User> = { id: fullUser.id, email: fullUser.email, isAdmin: fullUser.isAdmin, credits: fullUser.credits, firstName: fullUser.firstName };
                return res.status(200).json({ isAuthenticated: true, user: userResponse });
            }
        }
        
        return res.status(200).json({ isAuthenticated: false, user: null });
    });


    // -------------------------------------------------------------------------
    // 2. ENHANCEMENT ROUTES (CORE LOGIC)
    // -------------------------------------------------------------------------

    /**
     * ROUTE 2.1: UPLOAD AND JOB QUEUEING
     */
    app.post("/api/enhancements/upload", requireAuth, upload.single('image'), async (req: Request, res: Response) => {
        const userId = req.user!.id; 

        const enhancementType = req.body.enhancementType;
        const scale = 2; // Default scale
        const startTime = Date.now();

        if (!req.file || !enhancementType) {
            return res.status(400).json({ message: "Missing image file or enhancement type." });
        }

        let user: User | undefined; 
        let enhancementId: string | undefined;

        try {
            user = await storage.getUser(userId);

            if (!user || user.credits < ENHANCEMENT_COST) {
                return res.status(402).json({ message: "Insufficient credits." });
            }
            
            // 1. Deduct Credits IMMEDIATELY
            await storage.updateUserCredits(userId, user.credits - ENHANCEMENT_COST);

            // 2. CALCULATE ORIGINAL RESOLUTION
            const originalResolution = await readImageResolutionFromBuffer(req.file.buffer);

            // 3. Prepare Data URI
            const imageBase64 = req.file.buffer.toString('base64');
            const imageMime = req.file.mimetype;
            const originalImageUrl = `data:${imageMime};base64,${imageBase64}`; 

            // 4. CREATE DB RECORD in 'pending' status
            const pendingEnhancement = await storage.createEnhancement({
                userId,
                status: "pending",
                originalImageUrl: originalImageUrl, 
                enhancementType: enhancementType, 
                metadata: { enhancementType, scale },
                creditsUsed: ENHANCEMENT_COST,
                originalResolution: originalResolution, 
            });
            enhancementId = pendingEnhancement.id;
            
            console.log(`[DB SUCCESS] Created enhancement ID: ${enhancementId}. Status: pending. Resolution: ${originalResolution}`);
            
            // 5. Queue the AI Job (Do NOT await this)
            Promise.resolve(queueEnhancementJob(enhancementId, userId, imageBase64, enhancementType, scale, startTime));

            // 6. Send 202 Accepted response immediately
            return res.status(202).json({ 
                message: "Enhancement job created.", 
                enhancementId: enhancementId,
                creditsRemaining: user.credits - ENHANCEMENT_COST
            });

        } catch (error: any) {
            console.error('[CRITICAL UPLOAD ERROR]: Failed to create DB record or queue job:', error);
            
            // Safety Refund
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


    /**
     * ROUTE 2.2: HISTORY FETCH (Used by frontend for polling job status)
     */
    app.get("/api/enhancements", requireAuth, async (req: Request, res: Response) => {
        const userId = req.user!.id; 

        try {
            const enhancements = await storage.getUserEnhancements(userId);
            return res.status(200).json(enhancements);
        } catch (error) {
            console.error('Failed to fetch enhancements:', error);
            return res.status(500).json({ message: "Failed to fetch enhancement history." });
        }
    });
    
    
    /**
     * ROUTE 2.3: PYTHON WORKER COMPLETION WEBHOOK 
     */
    app.post("/api/enhancements/complete", async (req: Request, res: Response) => {
        const { jobId, enhancedImageBase64, finalMetrics, processingTime } = req.body;
        
        if (!jobId || !enhancedImageBase64 || !finalMetrics || !processingTime) {
            return res.status(400).json({ message: "Missing completion data from worker." });
        }

        try {
            const enhancedImageUrl = `data:image/png;base64,${enhancedImageBase64}`;

            const updateData: EnhancementUpdate = {
                enhancedImageUrl: enhancedImageUrl,
                status: "completed", 
                processingTime: Math.round(processingTime),
                psnr: finalMetrics.psnr,
                ssim: finalMetrics.ssim,
                mae: finalMetrics.mae,
                enhancedResolution: finalMetrics.enhancedResolution,
                processingProgress: 100,
                modelUsed: finalMetrics.modelUsed,
                // MODIFICATION: Automatically make completed jobs public
                isPublic: true, 
            } as unknown as EnhancementUpdate; 

            await storage.updateEnhancement(jobId, updateData);

            console.log(`[JOB COMPLETE] Enhancement ${jobId} finalized in DB. Model: ${finalMetrics.modelUsed}`);
            
            return res.status(200).send("Job finalized.");
            
        } catch (error) {
            console.error(`[CRITICAL FINALIZE ERROR] Failed to finalize job ${jobId}:`, error);
            return res.status(500).json({ message: "Failed to finalize job in database." });
        }
    });
    
    
    /**
     * ROUTE 2.4: GALLERY FETCH 
     */
    app.get("/api/gallery", async (req: Request, res: Response) => {
        try {
            const publicEnhancements = await storage.getPublicEnhancements(); 
            
            const galleryData = publicEnhancements.map(e => ({
                id: e.id,
                enhancementType: e.enhancementType,
                originalImageUrl: e.originalImageUrl,
                enhancedImageUrl: e.enhancedImageUrl,
                modelUsed: e.modelUsed,
                psnr: e.psnr,
                ssim: e.ssim,
                mae: e.mae,
                enhancedResolution: e.enhancedResolution,
            }));
            
            return res.status(200).json(galleryData);
        } catch (error) {
            console.error('Failed to fetch gallery items:', error);
            return res.status(500).json({ message: "Failed to fetch gallery examples." });
        }
    });


    const httpServer = createServer(app);
    return httpServer;
}