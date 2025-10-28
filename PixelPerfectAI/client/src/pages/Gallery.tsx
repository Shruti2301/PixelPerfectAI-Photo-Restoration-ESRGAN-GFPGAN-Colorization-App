// client/src/Gallery.tsx

import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Enhancement } from "@shared/schema";
import { ImageIcon, Maximize } from "lucide-react"; 

// Helper component for displaying metrics (reused from Dashboard)
const MetricLabel: React.FC<{ value: string; label: string; className?: string }> = ({ value, label, className }) => (
    <div className={`flex flex-col items-center p-2 rounded-lg bg-background ${className}`}>
        <span className="text-sm font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

// Helper function to safely convert Drizzle's numeric (string) to a formatted number.
const formatMetric = (value: string | number | null | undefined, precision: number): string => {
    if (value === null || value === undefined || value === 'null') {
        return 'N/A';
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
        return 'N/A';
    }
    return numValue.toFixed(precision);
};


export default function Gallery() {
  // Fetch enhancements from API
  const { data: enhancements, isLoading } = useQuery<Enhancement[]>({
    queryKey: ["/api/gallery"],
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Global Header */}
      <Header />

      <main className="pt-24 pb-20 flex-grow">
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
                  className="aspect-[4/3] bg-muted animate-pulse border-card-border" 
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
                  className="group overflow-hidden border-card-border hover-elevate transition-all duration-300 flex flex-col"
                  data-testid={`gallery-item-${index}`}
                >
                  {/* Before/After Image Split (1:1 aspect) */}
                  <div className="aspect-square relative flex-shrink-0">
                    <div className="absolute inset-0 grid grid-cols-2">
                      {/* Original Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={enhancement.originalImageUrl}
                          alt="Original"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium z-10">
                          Before
                        </div>
                      </div>
                      {/* Enhanced Image */}
                      <div className="relative overflow-hidden border-l border-border">
                        <img
                          src={enhancement.enhancedImageUrl || enhancement.originalImageUrl}
                          alt="After"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary/80 backdrop-blur-sm rounded text-xs font-medium text-primary-foreground z-10">
                          After
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhancement details & Metrics */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="text-lg font-bold capitalize">
                                {enhancement.enhancementType?.replace(/_/g, " ")}
                            </p>
                            {/* 🎯 FIX APPLIED: Removed the Model line */}
                        </div>
                    </div>
                    
                    {/* Metrics Grid - 🎯 FIX APPLIED: Grid columns and alignment fixed */}
                    <div className="grid grid-cols-3 gap-2 p-2 border rounded-lg bg-muted/50 mt-auto">
                        <MetricLabel value={formatMetric(enhancement.psnr, 2)} label="PSNR (dB)" />
                        <MetricLabel value={formatMetric(enhancement.ssim, 3)} label="SSIM" />
                        <MetricLabel value={formatMetric(enhancement.mae, 3)} label="MAE" />
                        
                        {/* Resolution spans across all 3 columns for better readability */}
                        <div className="col-span-3 text-center text-xs text-muted-foreground pt-1 border-t">
                            Resolution: {enhancement.enhancedResolution || 'N/A'}
                        </div>
                    </div>
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