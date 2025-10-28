// server/scripts/seed-gallery.ts

import 'dotenv/config'; 

import { db } from "../db"; 
import { enhancements } from "@shared/schema"; 
import { sql } from "drizzle-orm";

async function seedGallery() {
    console.log("Starting gallery seeding...");
    
    // Check if the DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not found in environment. Check your .env file.");
    }
    
    // Execute the Drizzle SQL update
    await db.execute(sql`
        UPDATE ${enhancements} 
        SET is_public = TRUE
        WHERE id IN (
            SELECT id FROM ${enhancements} 
            WHERE status = 'completed'
            ORDER BY created_at DESC  
            LIMIT 5  -- 🎯 FIX APPLIED: Limit changed to 5
        )
    `);

    console.log("Successfully marked 5 recent completed enhancements as public for the gallery.");
    process.exit(0);
}

seedGallery().catch(error => {
    console.error("Gallery seeding failed:", error.message);
    process.exit(1);
});