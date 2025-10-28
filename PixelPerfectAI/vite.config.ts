/**
 * Vite Configuration
 * -----------------
 * This configuration sets up Vite for a React project with Replit-specific plugins.
 * Features include:
 * 1. React support via @vitejs/plugin-react.
 * 2. Runtime error overlay for dev debugging.
 * 3. Conditional Replit plugins (Cartographer & Dev Banner) only in dev mode on Replit.
 * 4. Path aliases for cleaner imports.
 * 5. Custom build output directory.
 * 6. Secure dev server file system restrictions.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(), // Enables React Fast Refresh & JSX support
    runtimeErrorOverlay(), // Shows runtime errors in a modal overlay

    // Only load Replit dev plugins in development mode
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(), // Maps file changes in Replit IDE
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(), // Shows a dev banner for Replit users
          ),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"), // src alias
      "@shared": path.resolve(import.meta.dirname, "shared"), // shared code
      "@assets": path.resolve(import.meta.dirname, "attached_assets"), // asset imports
    },
  },

  root: path.resolve(import.meta.dirname, "client"), // Project root for Vite

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"), // Build output directory
    emptyOutDir: true, // Clears the output folder before each build
  },

  server: {
    fs: {
      strict: true, // Restrict access to files outside root
      deny: ["**/.*"], // Deny hidden files access
    },
  },
});
