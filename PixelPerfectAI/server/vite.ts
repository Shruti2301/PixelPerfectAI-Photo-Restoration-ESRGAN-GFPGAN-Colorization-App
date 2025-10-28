/**
 * ---------------------------------------------------------------------------
 * Vite Server & Express Integration Utilities
 * ---------------------------------------------------------------------------
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Purpose:
 * This file provides utility functions to integrate Vite with an Express server.
 * It handles both development mode with Vite HMR (Hot Module Replacement)
 * and production mode serving of static assets.
 *
 * Key Functions:
 * 1. log(message, source):
 *    - Logs formatted messages with a timestamp and optional source label.
 *
 * 2. setupVite(app, server):
 *    - Configures Vite in middleware mode for development.
 *    - Enables HMR using the provided HTTP server.
 *    - Dynamically serves and transforms the `index.html` template on each request.
 *    - Appends a cache-busting query string to main scripts for development.
 *
 * 3. serveStatic(app):
 *    - Serves pre-built static assets from the `public` folder for production.
 *    - Falls back to serving `index.html` for client-side routing.
 *
 * Notes:
 * - Designed to work with a React + TypeScript client located in `/client`.
 * - Uses `nanoid` to ensure HMR scripts are reloaded properly during development.
 * - Errors in template transformation during dev are handled by Vite’s `ssrFixStacktrace`.
 */

import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
