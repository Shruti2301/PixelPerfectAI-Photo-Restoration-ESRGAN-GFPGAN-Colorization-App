// server/migrate.ts (FINAL, WORKING IMPORT)

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as dotenv from 'dotenv'; 

// 🎯 FIX: Correct import for the 'pg' library Pool constructor in an ESM environment
import pkg from "pg"; 
const { Pool } = pkg; 

// Load environment variables (e.g., DATABASE_URL)
dotenv.config();

/**
 * Executes the Drizzle migrations against the database.
 */
async function runMigrations() {
    console.log("Starting database migration...");
    
    // Ensure the connection string is available
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set. Cannot run migrations.");
    }

    // 1. Setup Database Connection Pool
    const pool = new Pool({ // This line should now work
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // 2. Initialize Drizzle ORM instance
    const db = drizzle(pool); 

    try {
        // 3. Run Migrations
        await migrate(db, { migrationsFolder: "./drizzle" });

        console.log("✅ Database migration completed successfully!");
    } catch (error) {
        console.error("❌ Database migration failed:", error);
        process.exit(1);
    } finally {
        // 4. Close the connection
        await pool.end();
        console.log("Database connection closed.");
    }
}

runMigrations();