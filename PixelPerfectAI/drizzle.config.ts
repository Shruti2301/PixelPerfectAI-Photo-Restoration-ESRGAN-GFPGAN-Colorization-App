// drizzle.config.ts
// =============================================================
// Drizzle Kit Configuration File
// -------------------------------------------------------------
// Defines the settings for the Drizzle CLI to interact with 
// the database, generate migrations, and manage the schema.
// =============================================================
// Author: Shruti Mandaokar
// Date: October 2025

import { defineConfig } from "drizzle-kit";

// Ensure the DATABASE_URL environment variable is provided.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Ensure the database is provisioned and the URL is correct.");
}

/**
 * Drizzle Kit Configuration
 */
export default defineConfig({
  // FOLDER WHERE MIGRATION FILES WILL BE GENERATED
  out: "./drizzle", 

  // PATH TO THE SCHEMA DEFINITION FILE
  schema: "./shared/schema.ts", 

  // Database dialect (PostgreSQL)
  dialect: "postgresql",

  // Credentials to connect to the database (uses the ENV variable)
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  
  // Verbosity and strictness settings
  verbose: true,
  strict: true,
});