/**
 * Gallery.tsx
 *
 * Author: Shruti Mandaokar
 * Date: October 2025
 *
 * Description:
 * A community gallery showcasing before and after examples of AI-enhanced images.
 * Users can view enhancements done with ESRGAN, GFPGAN, U-Net, or other supported models.
 *
 * Features:
 *   - Hero section with page title and description.
 *   - Grid layout for enhancements.
 *   - Skeleton loading animation while fetching data.
 *   - "No examples yet" fallback when gallery is empty.
 *   - Before/After overlay labels for clarity.
 *
 * Technical Details:
 *   - React functional component with JSX.
 *   - Data fetched using React Query (`useQuery`) for caching and loading states.
 *   - Card and Image components styled with Tailwind CSS.
 *   - Lucide-react icons for empty state visualization.
 */

import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Enhancement } from "@shared/schema";
import { ImageIcon } from "lucide-react";

export default function Gallery() {
  // Fetch enhancements from API
  const { data: enhancements, isLoading } = useQuery<Enhancement[]>({
    queryKey: ["/api/gallery"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Gallery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover stunning before and after examples from our community
          </p>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-8">
          {isLoading ? (
            // Skeleton loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="aspect-square bg-muted animate-pulse border-card-border"
                  data-testid={`skeleton-${i}`}
                />
              ))}
            </div>
          ) : enhancements && enhancements.length > 0 ? (
            // Gallery items
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enhancements.map((enhancement, index) => (
                <Card
                  key={enhancement.id}
                  className="group overflow-hidden border-card-border hover-elevate transition-all duration-300"
                  data-testid={`gallery-item-${index}`}
                >
                  {/* Before/After Image Split */}
                  <div className="aspect-square relative">
                    <div className="absolute inset-0 grid grid-cols-2">
                      {/* Original Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={enhancement.originalImageUrl}
                          alt="Original"
                          className="absolute inset-0 w-full h-full object-cover"
                          data-testid={`gallery-original-${index}`}
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                          Before
                        </div>
                      </div>
                      {/* Enhanced Image */}
                      <div className="relative overflow-hidden border-l border-border">
                        <img
                          src={enhancement.enhancedImageUrl || enhancement.originalImageUrl}
                          alt="Enhanced"
                          className="absolute inset-0 w-full h-full object-cover"
                          data-testid={`gallery-enhanced-${index}`}
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary/80 backdrop-blur-sm rounded text-xs font-medium text-primary-foreground">
                          After
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhancement details */}
                  <div className="p-4">
                    <p className="text-sm font-medium capitalize">
                      {enhancement.enhancementType?.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enhancement.modelUsed || "AI Enhanced"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // Fallback when no gallery items exist
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No examples yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your enhanced images with the community
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
