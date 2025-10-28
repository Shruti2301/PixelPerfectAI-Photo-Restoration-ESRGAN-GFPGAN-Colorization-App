/**
 * FAQ.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * This component renders the Frequently Asked Questions (FAQ) page for PixelPerfectAI.
 * It provides users with answers to common questions across multiple categories.
 *
 * Features:
 *   - Hero Section: Page title and introductory description.
 *   - FAQ Categories: Organized into sections like Getting Started, Features, Credits, Privacy, and Technical.
 *   - Accordion UI: Questions can be expanded/collapsed for a clean, navigable interface.
 *   - Contact Section: Quick access to support via email if users need additional help.
 *
 * Technical Details:
 *   - Uses React for component structure and state handling.
 *   - Accordion and Card components for consistent styling and interactive UI.
 *   - Tailwind CSS for responsive design and spacing.
 *   - Data-driven rendering: FAQ content is stored in an array of objects for maintainability.
 *
 * Notes:
 *   - The accordion allows only one open item per category (type="single").
 *   - Each FAQ question has a unique test ID for testing purposes.
 *   - The page integrates with global Header and Footer components for consistent site layout.
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  // FAQ data structure: organized by category, each with an array of questions
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I get started with PixelPerfectAI?",
          a: "Simply sign up for a free account to receive 50 free credits. Upload an image, select your enhancement type, and let our AI do the work. No credit card required to start.",
        },
        {
          q: "What image formats are supported?",
          a: "We support JPEG, PNG, and WEBP formats. Maximum file size is 10MB per image.",
        },
        {
          q: "How long does image processing take?",
          a: "Most images are processed in 15-30 seconds. Larger images or 4x upscaling may take up to 60 seconds. Pro users get priority processing for faster results.",
        },
      ],
    },
    {
      category: "Features & Capabilities",
      questions: [
        {
          q: "What's the difference between 2x and 4x upscaling?",
          a: "2x upscaling doubles your image dimensions (e.g., 1000x1000 becomes 2000x2000), while 4x quadruples them (1000x1000 becomes 4000x4000). Both preserve and enhance details using our AI models.",
        },
        {
          q: "Can I enhance photos with people in them?",
          a: "Absolutely! We use specialized models like GFPGAN that excel at face enhancement and restoration, making it perfect for portraits and group photos.",
        },
        {
          q: "What types of enhancement are available?",
          a: "We offer super resolution upscaling (2x/4x), denoising, color enhancement, and general restoration. Each uses state-of-the-art AI models optimized for different use cases.",
        },
      ],
    },
    {
      category: "Credits",
      questions: [
        {
          q: "How do credits work?",
          a: "Each image enhancement uses 1 credit, regardless of the enhancement type. Credits on free plans never expire.",
        },
      ],
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "What happens to my images after processing?",
          a: "Your images are automatically deleted from our servers 24 hours after processing. We never use your images for training or any other purpose without explicit permission.",
        },
        {
          q: "Is my data secure?",
          a: "Absolutely. We use enterprise-grade encryption (HTTPS/TLS) for all data transfer and storage. Your images and personal information are protected with industry-standard security measures.",
        },
        {
          q: "Can I make my enhanced images public?",
          a: "Yes! When enhancing an image, you can choose to share it in our public gallery. This is completely optional - all images are private by default.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          q: "What AI models do you use?",
          a: "We primarily use Real-ESRGAN for general upscaling and GFPGAN for face enhancement. These are state-of-the-art models trained on millions of images to deliver professional results.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Global header */}
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section: page title and description */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about PixelPerfectAI
          </p>
        </section>

        {/* FAQ Sections: iterate over categories */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              {/* Category header */}
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {category.category}
              </h2>

              {/* Card container for accordion */}
              <Card className="border-card-border">
                {/* Single accordion per category */}
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, qIndex) => (
                    <AccordionItem
                      key={qIndex}
                      value={`${catIndex}-${qIndex}`} // unique accordion value
                      className="border-border"
                    >
                      {/* Question trigger */}
                      <AccordionTrigger
                        className="px-6 hover:no-underline hover-elevate"
                        data-testid={`faq-question-${catIndex}-${qIndex}`} // test identifier
                      >
                        <span className="text-left font-medium">{faq.q}</span>
                      </AccordionTrigger>

                      {/* Answer content */}
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          ))}
        </section>

        {/* Contact Section: fallback support */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 mt-20">
          <Card className="p-8 md:p-12 border-card-border text-center bg-gradient-to-br from-primary/5 to-chart-2/5">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get the most out of PixelPerfectAI
            </p>
            <a
              href="mailto:support@pixelperfectai.com"
              className="text-primary hover:underline font-medium"
              data-testid="link-contact-support"
            >
              Contact Support →
            </a>
          </Card>
        </section>
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
