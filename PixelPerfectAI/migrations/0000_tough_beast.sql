-- =========================================================
-- Migration File: Initial Schema Setup
-- Purpose: Create tables for users, sessions, enhancements, and analytics
--          with necessary constraints and indexes.
-- Database: PostgreSQL
-- Created: October 2025
-- Notes:
--   - The "users" table stores user accounts and subscription info.
--   - The "sessions" table is for session management.
--   - The "enhancements" table stores user-submitted image enhancements.
--   - The "analytics" table stores events for tracking user activity.
--   - Foreign key constraints enforce relationships between tables.
--   - Indexes are created for efficient querying of sessions.
-- =========================================================

CREATE TABLE "analytics" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "event_type" text NOT NULL,
    "user_id" varchar,
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE "enhancements" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" varchar NOT NULL,
    "original_image_url" text NOT NULL,
    "enhanced_image_url" text,
    "status" text DEFAULT 'pending' NOT NULL,
    "enhancement_type" text NOT NULL,
    "model_used" text,
    "processing_time" integer,
    "error_message" text,
    "metadata" jsonb,
    "is_public" boolean DEFAULT false NOT NULL,
    "credits_used" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE "sessions" (
    "sid" varchar PRIMARY KEY NOT NULL,
    "sess" jsonb NOT NULL,
    "expire" timestamp NOT NULL
);
--> statement-breakpoint

CREATE TABLE "users" (
    "id" varchar PRIMARY KEY NOT NULL,
    "email" text,
    "hashed_password" text,
    "first_name" text,
    "last_name" text,
    "profile_image_url" text,
    "is_admin" boolean DEFAULT false NOT NULL,
    "credits" integer DEFAULT 10 NOT NULL,
    "stripe_customer_id" text,
    "stripe_subscription_id" text,
    "subscription_tier" text DEFAULT 'free' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint

ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "enhancements" ADD CONSTRAINT "enhancements_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");
