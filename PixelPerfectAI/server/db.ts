// ===========================================================
// File: server/db.ts
// Author: Shruti Mandaokar
// Date: October 2025
//
// Purpose: Sets up database connection using Neon serverless 
//          and Drizzle ORM, including WebSocket support.
// Environment: Node.js with serverless Postgres (Neon)
// Dependencies:
//    - @neondatabase/serverless: Serverless Postgres client
//    - drizzle-orm/neon-serverless: ORM layer for Neon
//    - ws: WebSocket constructor for Neon realtime
// Notes:
//    - Ensure DATABASE_URL is set in environment variables
//      before running the application.
//    - Exports `pool` for direct DB client access and `db` 
//      for Drizzle ORM queries.
// ===========================================================

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
