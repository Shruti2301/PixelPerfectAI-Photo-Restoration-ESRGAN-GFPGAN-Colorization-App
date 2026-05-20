# 🧩 **PixelPerfectAI: From Blurriness to Brilliance ✨**

**PixelPerfectAI** is a comprehensive, decoupled full-stack **MLOps system** providing high-fidelity, AI-powered **Image Super-Resolution (SR)** and enhancement — all within seconds.

The project utilizes a **decoupled microservice architecture** to isolate heavy GPU computation from the core API for performance, scalability, and fault tolerance.



---


## 🌐 Backend (Node.js / Express API)

The API Gateway manages user requests, credit transactions, and job orchestration using a **Clean Architecture** pattern.

### 🧱 Architecture Overview

| Layer | Responsibility | Key Technologies |
| :--- | :--- | :--- |
| **Route Layer** | HTTP endpoints, Request/Response handling | Express, TypeScript |
| **Service Layer** | Business logic, Asynchronous Job Orchestration (Credits, Callbacks) | TypeScript |
| **Repository Layer** | Database operations, SQL generation | Drizzle ORM |
| **Entities Layer** | Data models, Drizzle Schema definitions | PostgreSQL, TypeScript |

### 🔑 Key Features

* **Asynchronous Job Orchestration:** Manages job handoff and secure callback from the Python Worker.
* **Atomic Credit Management:** Ensures credit deduction and job creation occur transactionally.
* **Secure Authentication:** JWT-based session management with **Passport Auth**.
* **Data Persistence:** Type-safe **PostgreSQL** integration using **Drizzle ORM**.
* **Monitoring:** Logs PSNR, SSIM, and processing time for every enhancement job.

### 📡 Core Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Login and receive an access token. |
| `POST` | `/api/v1/jobs/upload` | **Initiate** an asynchronous enhancement job (deducts credit). |
| `POST` | `/api/v1/jobs/callback` | **(Internal)** Receives final results and metrics from Python Worker. |
| `GET` | `/api/v1/users/me` | Fetch current user profile and credit balance. |
| `GET` | `/api/v1/gallery` | Retrieve public gallery of successful enhancements. |

---

## 🧠 Python Worker (ML Inference Service)

A dedicated high-throughput GPU service responsible for running all deep learning inference workloads. Deployed separately from the API to optimize compute usage.

### 🧩 Model Details

| Model | Parameters | Purpose | Key Loss Function |
| :--- | :--- | :--- | :--- |
| **Base** | 17 Billion | Real-world Blind Super-Resolution (**Real-ESRGAN-x4plus**) | Perceptual + Adversarial Loss |
| **Medical** | 17 Billion | Fine-tuned for BRATS / medical scans | L1/L2 + Total Variation Loss |
| **Colorization** | — | Adds color to grayscale images (**DDColor-L**) | L1 Loss (Color Prediction) |

### ⚙️ Performance & Compute

* **Infrastructure:** 4× NVIDIA RTX 4090 GPUs (via vast.ai cluster).
* **Metrics:** **SSIM** prioritized over PSNR for superior perceptual quality.
* **Communication:** Uses **HTTP callbacks** for job completion + shared **PostgreSQL** for status updates.

---

## 🎨 Frontend (React UI)

The user-facing interface is built for speed, accessibility, and real-time responsiveness.

### 🧰 Key Technologies

| Technology | Purpose |
| :--- | :--- |
| **Framework:** React + TypeScript | Highly performant UI |
| **Build Tool:** Vite | Fast HMR (Hot Module Replacement) |
| **Styling:** Tailwind CSS + Radix UI | Utility-first styling with accessible primitives |
| **State Management:** React Query | Handles server state and intelligent polling |
| **Animation:** Framer Motion | Smooth and cinematic transitions |

### ✨ Key Features

* **Real-Time Job Tracking:** Live progress updates via **React Query polling**.
* **Responsive Design:** Adaptive layouts using custom `useIsMobile` hook.
* **Comparison Modal:** High-fidelity, slider-based tool for original vs enhanced images.
###
---

## 🧰 Tech Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS, React Query, Framer Motion, Radix UI |
| **Backend** | Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, Passport Auth |
| **ML Worker** | Python, PyTorch, Real-ESRGAN, DDColor-L, BRATS Medical Models |
| **Infrastructure** | Docker, vast.ai GPU Cluster, REST API, JWT Auth |

---

## 🚀 Quick Start & Development

### 🧩 Dependencies

Ensure you have the following installed:
* Node.js (v18+)
* Python (v3.10+)

### 🧱 Development Workflow

> Entities & Schema → Repositories (Drizzle) → Services (Business Logic) → API Routes (Express) → UI Components (React)

### ⚡ Local Setup

```bash
# Clone repository
git clone [repository-url]
cd PixelPerfectAI

# Set up environment
cp backend/env.example backend/.env
cp python-worker/env.example python-worker/.env
# Update database credentials and SECRET_KEY in .env files
## 🏗️ **Project Structure**

```bash
├── frontend/           # React/Vite UI (Client)
├── backend/            # Node.js/Express API Gateway (Orchestration)
├── python-worker/      # Isolated ML Inference Service (High-Compute)
└── README.md           # This file
###



# Run services
docker-compose up -d
# PixelPerfectAI - AI-Powered Image Enhancement SaaS Platform

## Overview
PixelPerfectAI is a software for AI-powered image enhancement. Users can upload images and apply deep learning models for super-resolution upscaling, denoising, color enhancement, and face restoration.

## Features

### User-Facing Features
- **Authentication**:Auth (OAuth 2.0) with Google, GitHub, X, Apple, and email/password support
- **Public Marketing Pages**:
  - Landing page with hero section, features, and stats
  - How It Works - detailed process explanation
  - Gallery - public showcase of enhanced images
  - Pricing - tiered subscription plans (Free, Pro, Enterprise)
  - Architecture - technical overview and AI models
  - About - company story and values
  - FAQ - comprehensive Q&A

### Core Functionality
- **Dashboard**: Upload images, select enhancement types, view processing history
- **AI Enhancement**: SRCNN Real-ESRGAN and GFPGAN models 
  - 2x/4x super-resolution upscaling
  - Denoising and enhancement
  - Color enhancement
  - Face restoration
- **Credit System**: Usage-based billing with credits per enhancement
- **Admin Portal**: User management, analytics dashboard, system monitoring

### Technical Features
- **Database**: PostgreSQL with Drizzle ORM
- **File Upload**: Multer for image processing (JPEG, PNG, WEBP up to 10MB)
- **Payment Processing**: Stripe integration for subscriptions (ready for implementation)
- **Analytics**: Event tracking for user signups, uploads, and completions
- **Responsive Design**: Mobile-first design with Tailwind CSS and Shadcn UI

## Technology Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS + Shadcn UI for styling
- Framer Motion for animations
- Inter font family

### Backend
- Express.js with TypeScript
- PostgreSQL database (Neon)
- Drizzle ORM
- Replicate API for AI models
- Replit Auth (OpenID Connect)
- Multer for file uploads

### External Services
- Replicate - AI model hosting (Real-ESRGAN, GFPGAN)
- Stripe - Payment processing
- Replit Auth - User authentication

## Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Architecture.tsx
│   │   │   ├── About.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Admin.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   ├── replitAuth.ts     # Authentication setup
│   └── db.ts            # Database connection
├── shared/              # Shared code between frontend/backend
│   └── schema.ts       # Database schema and types
└── design_guidelines.md # UI/UX design specifications
```

## Database Schema

### Users Table
- id, email, firstName, lastName, profileImageUrl
- isAdmin (boolean)
- credits (integer, default: 10)
- stripeCustomerId, stripeSubscriptionId
- subscriptionTier (free/pro/enterprise)
- Timestamps: createdAt, updatedAt

### Enhancements Table
- id, userId (foreign key)
- originalImageUrl, enhancedImageUrl
- status (pending/processing/completed/failed)
- enhancementType (upscale_2x, upscale_4x, denoise, enhance)
- modelUsed, processingTime
- errorMessage (if failed)
- metadata (JSON)
- isPublic (boolean for gallery)
- creditsUsed (default: 1)
- createdAt

### Analytics Table
- id, eventType
- userId (nullable foreign key)
- metadata (JSON)
- createdAt

### Sessions Table
- sid (primary key)
- sess (JSONB)
- expire (timestamp)

## API Endpoints

### Authentication
- `GET /api/login` - Initiate OAuth login
- `GET /api/logout` - Logout user
- `GET /api/callback` - OAuth callback
- `GET /api/auth/user` - Get current user

### Enhancements
- `POST /api/enhancements/upload` - Upload and process image
- `GET /api/enhancements` - Get user's enhancement history
- `GET /api/gallery` - Get public enhancements

### Admin (protected)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/enhancements/recent` - Recent activity

## Environment Variables

Required secrets:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret
- `REPLICATE_API_TOKEN` - Replicate API key for AI models
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `REPLIT_DOMAINS` - Replit domain for OAuth
- `REPL_ID` - Replit project ID
- `ISSUER_URL` - OAuth issuer URL (defaults to https://replit.com/oidc)

## Design System

### Color Palette
- Primary: Purple (262° 80% 55%) - Brand color for CTAs and accents
- Secondary: Cyan (200° 95% 50%) - Highlights and secondary actions
- Success: Green (142° 70% 45%) - Completed states
- Background: Dark navy-black (240° 15% 8%) in dark mode
- Typography: Inter font family

### Components
- Shadcn UI component library
- Custom animations with Framer Motion
- Responsive grid layouts
- Glass-morphism effects

## User Roles

### Regular User
- Upload and enhance images
- View processing history
- Download enhanced images
- Manage account and credits

### Admin User
- All regular user capabilities
- Access admin dashboard
- View user analytics
- Monitor system performance
- Manage users


## AI Models

### Real-ESRGAN
- General purpose super-resolution upscaling
- 2x and 4x scaling factors
- Excellent for textures and details
- Model: nightmareai/real-esrgan

### GFPGAN (Planned)
- Specialized for face enhancement
- Portrait and face restoration
- Used when face_enhance is enabled

## Development

### Running the Application
```bash
npm run dev  # Starts both frontend and backend
```

### Database Operations
```bash
npm run db:push  # Push schema changes to database
```

### Project Status
- ✅ Complete database schema
- ✅ Replit Auth integration
- ✅ All public marketing pages
- ✅ User dashboard with image upload
- ✅ AI enhancement via Replicate
- ✅ Admin portal with analytics
- ✅ Credit system
- ⏳ Stripe payment integration (backend ready, frontend to be connected)

## Recent Changes (Oct 17, 2025)
- Implemented complete database schema with users, enhancements, analytics tables
- Built all frontend pages (Landing, How It Works, Gallery, Pricing, Architecture, About, FAQ)
- Created Dashboard with image upload and enhancement history
- Implemented Admin portal with user management and analytics
- Integrated Replicate API for AI image enhancement
- Set up Replit Auth for user authentication
- Configured PostgreSQL database with Drizzle ORM
- Implemented credit system with usage tracking

## Next Steps
2. Add batch processing for multiple images
3. Implement email notifications for processing completion
4. Add more AI models (GFPGAN for faces, colorization)
5. Build API access for developers
6. Implement referral program
