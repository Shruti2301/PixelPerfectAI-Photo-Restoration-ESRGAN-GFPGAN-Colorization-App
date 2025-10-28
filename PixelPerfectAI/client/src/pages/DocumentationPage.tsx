/**
 * DocumentationPage.tsx
 *
 * Author : Shruti Mandaokar
 * Date : October 2026
 *  
 * This component renders the Technical Documentation page for the PixelPerfectAI project.
 * It provides a comprehensive overview of the AI-powered image enhancement application.
 *
 * Key Features:
 *   - Table of Contents for easy navigation across sections.
 *   - Sections include:
 *       1. Introduction & Vision
 *       2. User Interface & Experience (UI/UX)
 *       3. ML Architecture & Models
 *       4. Technical Implementation
 *       5. Project Phases & Roadmap
 *       6. Key Components Breakdown
 *       7. Future Work & Enhancements
 *   - Uses React with Tailwind CSS for layout and styling.
 *   - Icons from lucide-react for visual cues next to section headers.
 *   - Responsive design for mobile and desktop.
 *   - Smooth hover effects and shadowed cards for table of contents.
 *
 * Notes:
 *   - Designed as a static documentation page to complement the AI image enhancement dashboard.
 *   - Uses Wouter for navigation links within the page.
 *   - Header and Footer components provide consistent layout across the site.
 */


import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, FileText, Code, Settings, GitBranch, Terminal, Cpu } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
          {/* Accent Badge - Subtle change to text-xs for a finer look */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <FileText className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Comprehensive Project Details</span>
          </div>
          {/* Main Title - Reduced font from 6xl to 5xl/4xl and increased tracking */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
            Technical Documentation
          </h1>
          {/* Subtitle - Reduced font from lg/xl to base/lg */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            A deep dive into the design, architecture, and implementation of our AI-powered image enhancement application.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-4 md:px-8 mb-20 space-y-16">
          {/* Table of Contents / Navigation - Enhanced Card Style for visual appeal */}
          <Card className="p-8 border border-primary/20 bg-card/80 shadow-2xl shadow-primary/10 transition-shadow duration-300 hover:shadow-primary/20">
            <h2 className="text-2xl font-extrabold mb-6 text-primary border-b border-primary/20 pb-3">
              Table of Contents
            </h2>
            {/* List Styling - Compacted vertical spacing with a smaller font and bolder hover */}
            <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
              <a href="#introduction" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 1. Introduction & Vision
              </a>
              <a href="#uiexperience" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 2. User Interface & Experience
              </a>
              <a href="#mlarchitecture" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 3. ML Architecture & Models
              </a>
              <a href="#technicalimpl" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 4. Technical Implementation
              </a>
              <a href="#projectphases" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 5. Project Phases & Roadmap
              </a>
              <a href="#keycomponents" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 6. Key Components Breakdown
              </a>
              <a href="#futurework" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:font-semibold transition-all">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> 7. Future Work
              </a>
            </nav>
          </Card>

          {/* SECTION STYLING: Reduced text size on headers and body, enhanced icon size */}

          {/* Section 1: Introduction & Project Vision */}
          <section id="introduction" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary/80" /> 1. Introduction & Vision
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              PixelPerfectAI is a <strong>cutting-edge web application</strong> developed as a deep learning class project, showcasing the power of <strong>advanced generative AI</strong> for image restoration and super-resolution. Our vision is to provide a seamless, high-fidelity experience that transforms degraded images into visually stunning, enhanced versions, embodying the promise of <strong>"from blurriness to brilliance."</strong> This document details the architectural decisions, technical implementations, and user experience considerations that underpin the project.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              The application leverages state-of-the-art models like <strong>ESRGAN, GFPGAN, and U-Net</strong>, integrated into a robust and scalable cloud-native platform. Designed with an emphasis on rapid feedback and intuitive interaction, PixelPerfectAI serves as a comprehensive demonstration of deploying complex deep learning models in a user-friendly web environment.
            </p>
          </section>

          {/* Section 2: User Interface & Experience */}
          <section id="uiexperience" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-primary/80" /> 2. User Interface & Experience (UI/UX)
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The UI/UX design prioritizes <strong>clarity, fidelity, and perceived velocity</strong>. A dark theme with neon teal accents is employed to maximize contrast and highlight image details. Micro-animations and progressive loading indicators are crucial for enhancing user perception of speed and quality.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-primary">2.1. Core Interaction Flow</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Upload Interface:</strong> A prominent drag-and-drop zone with clear file type and size constraints. Success triggers a smooth transition to the enhancement view.</li>
              <li><strong>Enhancement & Preview:</strong> Centralized side-by-side view with synchronized zoom and pan for "Before" and "After" images.</li>
              <li><strong>Detail Scrubber:</strong> A unique floating tool that, on click-and-hold, reveals a magnified "Before" cutout over the "After" image to powerfully demonstrate AI restoration.</li>
              <li><strong>Filter Control Panel:</strong> A clean sidebar for toggling enhancement features (Upscale, Deblur/Restore, Face Prioritization) and adjusting intensity.</li>
              <li><strong>Download & Share:</strong> Options for output format (PNG/JPEG) and quality, along with a shareable link mechanism.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">2.2. Perceived Performance Enhancements</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Micro-Animations:</strong> Smooth transitions for uploads, filter application (cross-dissolves), and button feedback (e.g., "Copied!").</li>
              <li><strong>Processing Feedback:</strong> The "After" image area displays a <strong>shimmering glow</strong> and rotating AI icon.</li>
              <li><strong>Progressive Preview:</strong> If supported by the model, the enhanced image gradually refines from blocky to sharp, providing real-time feedback during processing.</li>
            </ul>
          </section>

          {/* Section 3: ML Architecture & Models */}
          <section id="mlarchitecture" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-primary/80" /> 3. ML Architecture & Models
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The core of PixelPerfectAI is a sophisticated <strong>cascaded deep learning pipeline</strong> designed to leverage the strengths of specialized generative models. This approach ensures both high-fidelity restoration and super-resolution.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-primary">3.1. Model Pipeline</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              The image enhancement process follows a specific sequence:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Initial Degradation Removal (U-Net):</strong> The input image first passes through a U-Net based regressive model for initial denoising and deblurring.</li>
              <li><strong>Facial Enhancement (GFPGAN):</strong> If "Prioritize Faces" is active, detected face regions are channeled through GFPGAN for realistic face restoration.</li>
              {/* FIXED: Removed the invalid closing tags, comments, and the LaTeX/Markdown syntax */}
              <li><strong>General Super-Resolution (ESRGAN):</strong> The pre-processed image is then upscaled by ESRGAN, which synthesizes high-frequency textures for <strong>&times;2 or &times;4 magnification</strong>.</li>
              <li><strong>Fusion & Post-processing:</strong> The GAN output is blended with the U-Net's structural predictions to balance perceptual quality and fidelity.</li>
            </ol>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">3.2. Key Deep Learning Models</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>ESRGAN:</strong> Utilizes Residual-in-Residual Dense Blocks (<strong>RRDBs</strong>) and perceptual loss for photo-realistic texture hallucination during upscaling.</li>
              <li><strong>GFPGAN:</strong> Employs a U-Net generator with a pre-trained <strong>StyleGAN2 prior</strong>, optimized for high-quality, identity-preserving facial restoration.</li>
              <li><strong>U-Net:</strong> A robust encoder-decoder architecture used for structural reconstruction, denoising, and deblurring.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">3.3. Metrics for Evaluation</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Quantitative and qualitative metrics are crucial for model training and user feedback:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>PSNR</strong> (Peak Signal-to-Noise Ratio): An objective, pixel-level fidelity metric (higher is better).</li>
              <li><strong>LPIPS</strong> (Learned Perceptual Image Patch Similarity): A <strong>perceptual metric</strong> that correlates better with human judgment (lower is better).</li>
            </ul>
          </section>

          {/* Section 4: Technical Implementation */}
          <section id="technicalimpl" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-primary/80" /> 4. Technical Implementation
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The application follows a modern <strong>cloud-native architecture</strong>, prioritizing scalability, performance, and maintainability.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-primary">4.1. Frontend</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Framework:</strong> React.js for dynamic UI components.</li>
              <li><strong>Styling:</strong> Tailwind CSS for utility-first styling, ensuring responsiveness and a consistent design system.</li>
              <li><strong>Routing:</strong> Wouter for a lightweight client-side routing solution.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">4.2. Backend & ML Deployment</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>ML Inference:</strong> Models are deployed as scalable <strong>GPU Edge Functions</strong> to minimize latency and scale on demand.</li>
              <li><strong>Model Format:</strong> PyTorch models are converted to <strong>ONNX</strong> for optimized inference performance.</li>
              <li><strong>Authentication:</strong> <strong>JWT</strong> (JSON Web Tokens) for secure, stateless user sessions.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">4.3. Infrastructure Design Principles</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Scalability:</strong> Achieved through serverless compute for ML tasks.</li>
              <li><strong>Low Latency:</strong> Critical due to use of GPU Edge Functions.</li>
              <li><strong>Observability:</strong> Basic logging and monitoring for model inference times.</li>
            </ul>
          </section>

          {/* Section 5: Project Phases & Roadmap */}
          <section id="projectphases" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <GitBranch className="w-6 h-6 text-primary/80" /> 5. Project Phases & Roadmap
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The project followed a <strong>structured development roadmap</strong> to ensure systematic progress and integration of complex components.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-primary">5.1. Phase Breakdown</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Phase 1:</strong> Core Infrastructure (Auth, Database).</li>
              <li><strong>Phase 2:</strong> Frontend Structure (Layouts, Navigation).</li>
              <li><strong>Phase 3:</strong> ML Integration (Model Deployment, API).</li>
              <li><strong>Phase 4:</strong> UI/UX Refinement (Comparison Tools, Controls).</li>
              <li><strong>Phase 5:</strong> Documentation & Testing (Final Review).</li>
            </ol>
          </section>

          {/* Section 6: Key Components Breakdown */}
          <section id="keycomponents" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-primary/80" /> 6. Key Components Breakdown
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Here’s a closer look at some critical components and their roles:
            </p>

            <h3 className="text-lg font-semibold mb-3 text-primary">6.1. Authentication System</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Technology:</strong> JWT (JSON Web Tokens) for secure, stateless sessions.</li>
              <li><strong>Roles:</strong> Differentiates between 'User' and 'Admin'.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">6.2. Admin Portal (Conceptual)</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Purpose:</strong> Monitor system health, usage statistics, and model performance.</li>
              <li><strong>Key Metrics:</strong> GPU load, total images processed, average inference latency.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-primary mt-6">6.3. Image Handling</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Uploads:</strong> Client-side validation before transmission.</li>
              <li><strong>Processing:</strong> Backend sends image to ML inference service.</li>
              <li><strong>Storage:</strong> Temporary cloud storage with timed deletion policies.</li>
            </ul>
          </section>

          {/* Section 7: Future Work */}
          <section id="futurework" className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
              <GitBranch className="w-6 h-6 text-primary/80" /> 7. Future Work & Enhancements
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              As a class project, PixelPerfectAI lays a strong foundation. Potential future enhancements include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed pl-4">
              <li><strong>Batch Processing:</strong> Allow simultaneous processing of multiple images.</li>
              <li><strong>Video Enhancement:</strong> Extend the ML pipeline to process video frames.</li>
              <li><strong>User Accounts & History:</strong> Implement persistent user accounts with image history.</li>
            </ul>
          </section>
        </section> {/* End of main documentation content */}
      </main>

      <Footer />
    </div>
  );
}