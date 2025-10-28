# PixelPerfectAI Design Guidelines

## Design Approach

**Selected Approach:** Hybrid Reference-Based
- **Primary References:** Linear (modern SaaS polish), Figma (professional tool aesthetic), Adobe Creative Cloud (image tool credibility)
- **Justification:** This AI-powered image enhancement SaaS requires both marketing appeal and professional tool credibility. The visual-rich nature (showcasing before/after comparisons) demands sophisticated UI patterns while maintaining accessibility and performance.

## Core Design Principles

1. **Professional Polish:** Clean, modern aesthetic that conveys AI-powered precision
2. **Visual Confidence:** Bold use of enhanced imagery to demonstrate product value
3. **Clarity Over Decoration:** Purposeful animations that guide users, not distract
4. **Responsive Excellence:** Seamless experience across all devices

## Color Palette

### Marketing Pages (Home, Pricing, About, FAQ, How It Works)
- **Primary Brand:** 262 80% 55% (Deep vibrant purple)
- **Primary Light:** 262 75% 65% (For hover states, lighter accent)
- **Secondary:** 200 95% 50% (Bright cyan - used sparingly for CTAs and highlights)
- **Background Dark:** 240 15% 8% (Rich dark navy-black)
- **Background Light:** 0 0% 98% (Off-white for light mode)
- **Surface Dark:** 240 12% 12% (Elevated cards/panels)
- **Surface Light:** 0 0% 100% (White cards)
- **Text Primary Dark:** 0 0% 95%
- **Text Primary Light:** 0 0% 10%
- **Text Secondary Dark:** 0 0% 70%
- **Text Secondary Light:** 0 0% 45%
- **Success:** 142 70% 45% (Green for completed enhancements)
- **Error:** 0 85% 60% (Red for failures)
- **Warning:** 38 90% 55% (Amber for processing states)

### Application Pages (Dashboard, Upload, Enhancement Tool)
- Same base palette with emphasis on neutral backgrounds for image work
- **Canvas Background:** 0 0% 6% (Darker neutral for image viewing)
- **Tool Panel:** 240 10% 10% (Subtle dark panels for controls)
- Minimize color distractions when users are working with images

## Typography

**Font Stack:**
- **Display/Headings:** 'Inter', system-ui, sans-serif (Weight: 700-800)
- **Body/UI:** 'Inter', system-ui, sans-serif (Weight: 400-500)
- **Code/Technical:** 'JetBrains Mono', monospace (For architecture page, technical specs)

**Scale:**
- Hero Headlines: text-6xl md:text-7xl lg:text-8xl (Bold, 700-800)
- Section Headers: text-4xl md:text-5xl (Bold, 700)
- Subsection Headers: text-2xl md:text-3xl (Semibold, 600)
- Body Large: text-lg md:text-xl (Regular, 400)
- Body: text-base (Regular, 400)
- Small/Caption: text-sm (Medium, 500)
- Button Text: text-sm md:text-base (Semibold, 600)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: p-2, gap-2 (tight element spacing)
- Component spacing: p-4, p-6, gap-4 (cards, inputs)
- Section spacing: py-12 md:py-16 lg:py-24 (vertical rhythm)
- Container spacing: px-4 md:px-8 lg:px-12 (responsive margins)
- Large gaps: gap-8, gap-12 (grid layouts, feature sections)

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto
- Text content: max-w-4xl for readability
- Tool canvas: max-w-screen-2xl for image workspace

## Component Library

### Navigation
- **Header:** Fixed top, glass-morphism backdrop (backdrop-blur-xl bg-opacity-80), subtle bottom border
- **Logo:** Left-aligned with icon + wordmark
- **Nav Links:** Center or right-aligned, text-sm font-medium, hover:text-primary transition
- **CTA Button:** Primary purple gradient, prominent in header
- **Mobile:** Slide-in drawer with smooth animation

### Hero Sections (Marketing Pages)
- **Home Hero:** Full-screen (min-h-screen) with large before/after image comparison showcase
- **Split Layout:** 60/40 split - left for headline/CTA, right for animated visual demo
- **Background:** Subtle radial gradient overlay, animated gradient mesh effect (CSS)
- **CTA Buttons:** Primary (solid purple gradient) + Secondary (outline with backdrop blur)

### Feature Cards
- **Layout:** Grid system - grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Card Style:** Glass-morphism with subtle border (border border-white/10)
- **Icon Treatment:** 48x48 icon in colored circle (bg-primary/10), top-left of card
- **Spacing:** p-6 with gap-4 for internal elements
- **Hover:** Subtle lift (translate-y-[-4px]) with shadow transition

### Image Upload Zone
- **Dashed Border:** border-2 border-dashed border-primary/30
- **Hover State:** border-primary bg-primary/5 with scale-[1.02] transform
- **Drop State:** bg-primary/10 with animated pulse
- **Icon:** Large upload cloud icon (96x96) with text-primary/50
- **Size:** Min-height of 400px on desktop, responsive on mobile

### Before/After Comparison Slider
- **Layout:** Relative container with overflow-hidden
- **Slider Handle:** Absolute positioned, draggable, with circular handle (48x48)
- **Handle Design:** White circle with shadow, subtle purple accent ring on drag
- **Labels:** Top corners - "Original" (left) and "Enhanced" (right) with backdrop blur pills
- **Interaction:** Smooth drag with transform, no janky updates

### Dashboard Layout
- **Sidebar:** Fixed left, w-64, glass panel with navigation links
- **Main Content:** ml-64 with responsive collapse on mobile
- **Stats Cards:** Grid of metric cards showing usage, credits, processing history
- **Recent Images:** Masonry grid or responsive grid of thumbnail cards

### Admin Portal
- **Data Tables:** Clean, striped rows with hover states
- **Charts:** Integration area for analytics (use Chart.js/Recharts placeholders)
- **Action Buttons:** Icon + text for user management operations
- **Filters:** Top bar with search, date range, status filters

### Pricing Cards
- **Layout:** Three-column grid (stacks on mobile)
- **Emphasis:** Middle "Pro" plan elevated with scale-105 and subtle glow
- **Features List:** Checkmarks with icon, clean vertical spacing (gap-3)
- **CTA Buttons:** Full-width within card, different states per tier

### Forms (Login, Signup, Contact)
- **Input Style:** Dark background (bg-white/5), border-white/10, focus:border-primary
- **Labels:** text-sm font-medium mb-2
- **Error States:** Red border + error message below input
- **Submit Buttons:** Full-width, primary gradient, loading states with spinner

### Gallery Page
- **Layout:** Masonry grid using grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Image Cards:** Before/after side-by-side or slider within card
- **Hover:** Overlay with enhancement details (upscale factor, model used)
- **Filters:** Top bar for sorting (Most Recent, Most Popular, Model Type)

### FAQ Page
- **Accordion Style:** Clean expandable sections with chevron icons
- **Hover:** Subtle background color change
- **Open State:** Smooth height animation with rotate transform on chevron

### Footer
- **Layout:** Multi-column grid (Company, Product, Resources, Legal)
- **Newsletter:** Inline signup form with email input + submit button
- **Social Links:** Icon buttons with hover states
- **Trust Badges:** Row of security/payment icons if applicable

## Animations & Micro-interactions

**Use Sparingly:**
- **Page Transitions:** Subtle fade-in on route change (150ms)
- **Processing States:** Smooth progress bar with indeterminate animation for AI processing
- **Upload:** File upload with animated progress circle
- **Hover States:** 200ms ease-in-out transitions on interactive elements
- **Success States:** Brief scale pulse on completion (1.05 scale for 200ms)

**Avoid:**
- Parallax scrolling effects (can feel dated)
- Excessive particle animations
- Auto-playing video backgrounds
- Infinite scroll animations

## Images & Visual Assets

**Hero Images:**
- **Home Page:** Large before/after comparison showcasing dramatic enhancement (landscape photo upscaled, architectural detail sharpened)
- **How It Works:** Step-by-step visual process diagrams with example images
- **Gallery:** Grid of impressive before/after transformations
- **About:** Team photo or product visualization

**Placeholder Strategy:**
- Use high-quality stock images from Unsplash for before/after examples
- Architecture diagrams: Clean vector illustrations showing AI pipeline
- Icons: Lucide React or Heroicons throughout

## Page-Specific Guidance

**Home:** Bold hero with animated comparison slider, 3-column features, testimonial carousel, CTA section
**How It Works:** 4-step process with numbered cards, visual flow diagram, example outputs
**Pricing:** Three-tier comparison table, feature matrix, FAQ accordion below
**Gallery:** Filterable masonry grid, lightbox on click, enhancement metadata
**Architecture:** Technical diagram with component breakdown, system flow, technology stack badges
**About:** Mission statement, team grid, company values, contact info
**FAQ:** Categorized accordion sections (Getting Started, Pricing, Technical, Privacy)