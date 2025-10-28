// server/index.ts
// ===========================================================
// File: server/index.ts
// Author: Shruti Mandaokar
// Date: October 2025
//
// Purpose: Sets up and starts the Express server, configures
//          global middleware, logging, API routes, and
//          development/production client handling via Vite.
//
// Environment: Node.js, Express, TypeScript
// Dependencies:
//    - express: Server framework
//    - http: Node HTTP server
//    - ./routes: API route registration
//    - ./vite: Vite dev/prod client setup
// Notes:
//    - Logging middleware captures API request duration and
//      JSON responses for debugging.
//    - In development mode, Vite HMR is enabled.
//    - In production mode, static assets are served from /.
// ===========================================================


import express, { type Request, type Response, NextFunction } from "express";
import { registerRoutes } from "./routes"; 
import { setupVite, serveStatic, log } from "./vite"; 
import { Server } from "http"; 

const app = express();

// --- 1. Global Middleware ---

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    
    // FIX: Remove '...args' from the apply call to resolve TS2345.
    // The override function still accepts '...args' to match the function signature,
    // but the original Express res.json only expects the body, which is what the type checker is enforcing.
    res.json = function<T>(this: Response, bodyJson: T, ...args: any[]): Response<T> { 
        capturedJsonResponse = bodyJson as Record<string, any>; 
        // Pass only the body (bodyJson) to the original function
        return originalResJson.apply(this, [bodyJson]); 
    } as unknown as typeof res.json; 

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                const logBody = { ...capturedJsonResponse }; 
                logLine += ` :: ${JSON.stringify(logBody)}`;
            }
            log(logLine);
        }
    });

    next();
});

// --- 2. Route Registration & Server Start ---

const isDevelopment = process.env.NODE_ENV !== 'production';

(async () => {
    // 1. API ROUTES REGISTRATION
    const server: Server = await registerRoutes(app); 

    // 2. Conditional Setup: Handles all non-API GET requests
    if (isDevelopment) {
        console.log("🟡 Running in Development Mode: Setting up Vite HMR.");
        // Correctly passing both app and server
        await setupVite(app, server); 
    } else {
        console.log("🟢 Running in Production Mode: Serving static client assets.");
        serveStatic(app); 
    }

    // 3. Start Listening
    const port = parseInt(process.env.PORT || '5001', 10);
    const host = process.env.HOST || "0.0.0.0";
    
    server.listen(port, () => { 
        console.log(`\n\n✅ Server is serving on http://localhost:${port}`); 
        console.log(`✅ Client assets are served from /`);
    });

    process.on("SIGTERM", () => {
        console.log("SIGTERM received. Closing server.");
        server.close(() => {
            process.exit(0);
        });
    });

})();