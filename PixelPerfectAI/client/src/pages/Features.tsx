/**
 * FeaturesPage.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * This page showcases the core features of PixelPerfectAI, including
 * the combined capabilities of ESRGAN, GFPGAN, and U-Net models.
 * Users can explore technical details, try a free demo, and navigate
 * to the full documentation.
 *
 * Features:
 *   - Hero Section: Introduces model capabilities.
 *   - Capabilities Card: Highlights features, free test credits, and CTA.
 *   - Documentation/FAQ Section: Provides technical explanations.
 *   - CTA Section: Encourages users to view full project docs.
 *
 * Technical Details:
 *   - React functional component with JSX.
 *   - Uses Card and Button components from UI library.
 *   - Integrates useAuth hook for conditional CTA rendering.
 *   - Tailwind CSS for responsive design and styling.
 *   - Lucide-react icons for visual cues (Check, Sparkles, Cpu).
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Sparkles, Cpu } from "lucide-react"; // Icon imports
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function FeaturesPage() {
  const { isAuthenticated } = useAuth(); // Auth state to conditionally render CTA links

  // Core capabilities object containing description, features list, and CTA text
  const capabilities = {
    name: "Full Feature Demo",
    tag: "Primary Showcase",
    description: "The complete, end-to-end implementation of our Deep Learning image restoration pipeline.",
    cta: "Start Enhancing Now",
    features: [
      "Full access to the image enhancement editor",
      "4x upscaling using the advanced ESRGAN model",
      "High-fidelity facial restoration via GFPGAN integration",
      "Noise reduction and deblurring using the U-Net prior",
      "Debug metrics panel (PSNR/LPIPS) for technical analysis",
      "10 test credits provided for model evaluation",
      "Lossless PNG and technical export formats",
      "Deployed on a dedicated GPU edge function for speed",
    ],
    testId: "mode-full-demo",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Cpu className="w-4 h-4 text-primary" /> {/* Icon representing technical/core capabilities */}
            <span className="text-sm font-medium text-primary">Core Project Capabilities</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Model Features
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the combined power of ESRGAN, GFPGAN, and U-Net working together to restore image detail.
          </p>
        </section>

        {/* Capabilities Card */}
        <section className="max-w-3xl mx-auto px-4 md:px-8 mb-20">
          <Card
            className="p-8 border-primary shadow-lg bg-card"
            data-testid={capabilities.testId}
          >
            {/* Tag label */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
              {capabilities.tag}
            </div>

            {/* Name, description, and FREE label */}
            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold mb-2">{capabilities.name}</h3>
              <p className="text-muted-foreground mb-4">{capabilities.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-green-500">FREE</span>
                <span className="text-muted-foreground">for project evaluation</span>
              </div>
            </div>

            {/* Features List */}
            <h4 className="text-lg font-semibold mb-4 border-b border-border pb-2">Integrated Features</h4>
            <ul className="space-y-3 mb-8">
              {capabilities.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Conditional CTA */}
            {isAuthenticated ? (
              <Link href="/enhance">
                <a data-testid={`button-${capabilities.testId}`}>
                  <Button className="w-full">
                    {capabilities.cta}
                  </Button>
                </a>
              </Link>
            ) : (
              <a href="/api/login" data-testid={`button-${capabilities.testId}`}>
                <Button className="w-full">
                  {capabilities.cta}
                </Button>
              </a>
            )}
          </Card>
        </section>

        {/* Documentation / FAQ Cards Section */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Documentation & Core Concepts
          </h2>
          <div className="space-y-6">
            {/* FAQ Cards */}
            <Card className="p-6 border-card-border">
              <h3 className="text-lg font-semibold mb-2">How do credits work in Demo Mode?</h3>
              <p className="text-muted-foreground">
                Each enhancement uses 1 credit. For example, upscaling an image 4x uses 1 credit.
                This allows for 10 full-cycle test runs to evaluate the core model.
              </p>
            </Card>
            <Card className="p-6 border-card-border">
              <h3 className="text-lg font-semibold mb-2">What is the technical breakdown of the enhancement pipeline?</h3>
              <p className="text-muted-foreground">
                The image is sequentially processed by a U-Net for structural restoration, GFPGAN for face refinement, and finally ESRGAN for super-resolution, ensuring optimal fidelity and texture hallucination.
              </p>
            </Card>
            <Card className="p-6 border-card-border">
              <h3 className="text-lg font-semibold mb-2">How is the core model (ESRGAN) deployed?</h3>
              <p className="text-muted-foreground">
                The model is deployed as a scalable GPU Edge Function for low-latency inference, using PyTorch and ONNX for optimized performance.
              </p>
            </Card>
            <Card className="p-6 border-card-border">
              <h3 className="text-lg font-semibold mb-2">Where can I find the full project documentation?</h3>
              <p className="text-muted-foreground">
                The complete design specification, model training, and API documentation is available via the View Full Docs button below.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA to Full Docs */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Dive into the Details?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore the full project documentation and technical specifications.
          </p>
          <Link href="/documentation">
            <a data-testid="button-view-faq">
              <Button size="lg" variant="outline" className="text-base px-8">
                View Full Docs
              </Button>
            </a>
          </Link>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
