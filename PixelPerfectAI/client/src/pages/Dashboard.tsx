/**
 * Dashboard.tsx
 *
 * This version includes:
 * - Full upload progress bar implementation.
 * - Processing Progress Bar in the History section when status is 'processing'.
 * - Display of AI metrics (PSNR, SSIM, MAE, Resolution) upon completion.
 * - FIX APPLIED: Safe conversion from Drizzle 'numeric' string to Number() for toFixed() calls.
 * - NEW FEATURE: Side-by-side comparison modal with metrics.
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth"; 
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Enhancement } from "@shared/schema"; 
import { isUnauthorizedError } from "@/lib/authUtils";
import axios from 'axios'; 
import {
  Upload,
  Sparkles,
  Download,
  Loader2,
  Image as ImageIcon,
  Coins,
  Zap,
  SplitSquareHorizontal, // Added for Compare button
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Added for the comparison modal
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; 
import { Progress } from "@/components/ui/progress"; // Assuming this exists


// Helper component for displaying metrics
const MetricLabel: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="flex flex-col">
        <span className="font-semibold">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

// FIX: Helper function to safely convert Drizzle's numeric (string) to a formatted number.
const formatMetric = (value: string | number | null | undefined, precision: number): string => {
    if (value === null || value === undefined || value === 'null') { // Added 'null' string check
        return 'N/A';
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
        return 'N/A';
    }
    return numValue.toFixed(precision);
};


export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancementType, setEnhancementType] = useState("upscale_2x"); 
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  // State for the comparison modal
  const [selectedEnhancement, setSelectedEnhancement] = useState<Enhancement | null>(null);


  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  // Fetch user's enhancement history
  const { data: enhancements, isLoading: enhancementsLoading } = useQuery<Enhancement[]>({
    queryKey: ["/api/enhancements"],
    enabled: isAuthenticated,
    
    refetchInterval: (data) => {
        if (Array.isArray(data)) {
            const hasActiveJob = data.some(e => e.status === 'processing' || e.status === 'pending');
            return hasActiveJob ? 5000 : false; 
        }
        return false;
    }
  });

  // Upload and enhance mutation (logic unchanged)
  const enhanceMutation = useMutation({
    mutationFn: async (data: { file: File; type: string }) => {
      setUploadProgress(0); 
      const formData = new FormData();
      formData.append("image", data.file);
      formData.append("enhancementType", data.type); 

      const response = await axios.post("/api/enhancements/upload", formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      if (response.status !== 200 && response.status !== 202) {
         throw new Error(response.data.message || `Server error: ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      setUploadProgress(100); 
      toast({
        title: "Enhancement Started",
        description: "Your image is being processed. Check history for updates.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enhancements"] }); 
      queryClient.invalidateQueries({ queryKey: ["api", "session"] });
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onError: (error) => {
      const errorMessage = (error as Error)?.message || "An unexpected error occurred during upload.";

      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setUploadProgress(0); 
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleEnhance = () => {
    if (selectedFile) {
      // NOTE: Cost checking logic is simplified here to 1 credit.
      // You may need to implement a more complex cost map lookup if costs vary by type.
      if (currentCredits < 1) {
          toast({
            title: "Insufficient Credits",
            description: "Please upgrade your plan to enhance images.",
            variant: "destructive",
          });
          return;
      }
      enhanceMutation.mutate({ file: selectedFile, type: enhancementType });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentCredits = user?.credits || 0;
  const currentFirstName = user?.firstName || ''; 
  const currentPlan = user?.subscriptionTier || 'Free';


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back{currentFirstName ? `, ${currentFirstName}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              Enhance your images with AI-powered technology
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credits Remaining</p>
                  <p className="text-3xl font-bold" data-testid="text-credits">
                    {currentCredits}
                  </p>
                </div>
                <Coins className="w-10 h-10 text-primary" />
              </div>
            </Card>
            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan</p>
                  <p className="text-2xl font-bold capitalize" data-testid="text-plan">
                    {currentPlan}
                  </p>
                </div>
                <Zap className="w-10 h-10 text-chart-2" />
              </div>
            </Card>
            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Enhancements</p>
                  <p className="text-3xl font-bold" data-testid="text-enhancements-count">
                    {enhancements?.length || 0}
                  </p>
                </div>
                <Sparkles className="w-10 h-10 text-chart-3" />
              </div>
            </Card>
          </div>

          {/* Upload Section */}
          <Card className="p-8 mb-8 border-card-border">
            <h2 className="text-2xl font-bold mb-6">Enhance New Image</h2>

            {!selectedFile ? (
              // Dropzone UI
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
                data-testid="dropzone-upload"
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Drop your image here, or click to browse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Supports JPEG, PNG, WEBP up to 10MB
                </p>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-file"
                />
                <label htmlFor="file-upload">
                  <Button asChild data-testid="button-browse">
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            ) : (
              // File Selected UI
              <div className="space-y-6">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={previewUrl!}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    data-testid="img-preview"
                  />
                </div>

                {/* Upload Progress Bar */}
                {enhanceMutation.isPending ? (
                   <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                           <p className="font-medium">
                               {uploadProgress < 100 ? 'Uploading Image...' : 'Submitting for Enhancement...'}
                           </p>
                           <p>{uploadProgress}%</p>
                       </div>
                       <div className="h-2 bg-muted rounded-full overflow-hidden">
                           <div 
                               className="h-full bg-primary transition-all duration-300"
                               style={{ width: `${uploadProgress}%` }}
                           />
                       </div>
                       {uploadProgress === 100 && (
                           <p className="text-xs text-muted-foreground">
                               Waiting for AI job to start. Check history below for progress updates.
                           </p>
                       )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                              Enhancement Type
                            </label>
                            <Select value={enhancementType} onValueChange={setEnhancementType}>
                              <SelectTrigger data-testid="select-enhancement-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="upscale_2x">2x Super Resolution</SelectItem>
                                <SelectItem value="upscale_4x">4x Super Resolution</SelectItem>
                                <SelectItem value="sharpening">Sharpening / Face Restoration</SelectItem> 
                                <SelectItem value="denoise">Denoise & Enhance</SelectItem>
                                <SelectItem value="enhance">Color Enhancement</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={handleEnhance}
                              disabled={enhanceMutation.isPending || currentCredits < 1}
                              className="flex-1"
                              data-testid="button-enhance"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Enhance Image (1 credit)
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl(null);
                              }}
                              data-testid="button-cancel"
                            >
                              Cancel
                            </Button>
                          </div>
                          
                          {currentCredits < 1 && (
                            <p className="text-sm text-destructive">
                              You don't have enough credits. Please upgrade your plan.
                            </p>
                          )}
                    </div>
                )}
              </div>
            )}
          </Card>

          {/* History Section */}
          <Card className="p-8 border-card-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Enhancement History</h2>
              {enhancements && enhancements.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {enhancements.length} total
                </span>
              )}
            </div>

            {enhancementsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : enhancements && enhancements.length > 0 ? (
              <div className="space-y-4">
                {enhancements.map((enhancement, index) => (
                  <div
                    key={enhancement.id}
                    className="flex flex-col md:grid md:grid-cols-3 gap-6 p-4 rounded-lg border border-border transition-all"
                    data-testid={`enhancement-item-${index}`}
                  >
                    
                    {/* --- 1. IMAGE CONTAINERS (Side-by-Side) --- */}
                    <div className="flex gap-4 col-span-1">
                        {/* Original Image */}
                        <div className="flex flex-col items-center w-28 h-28 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                            <img
                                // FIX: Use nullish coalescing for safety against 'null' or undefined from API
                                src={enhancement.originalImageUrl ?? undefined}
                                alt="Original"
                                className="w-full h-full object-cover"
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-center">Original</p>
                        </div>
                        
                        {/* Enhanced Image (Conditional) */}
                        {enhancement.status === "completed" && enhancement.enhancedImageUrl ? (
                            <div className="flex flex-col items-center w-28 h-28 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-primary-100 flex-shrink-0 border-2 border-primary">
                                <img
                                    // FIX: Use nullish coalescing for safety
                                    src={enhancement.enhancedImageUrl ?? undefined}
                                    alt="Enhanced"
                                    className="w-full h-full object-cover"
                                />
                                <p className="text-xs font-semibold text-primary mt-1 text-center">Enhanced</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-28 h-28 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 text-center text-xs text-muted-foreground border">
                                <ImageIcon className="w-5 h-5 mb-1" />
                                Pending
                            </div>
                        )}
                    </div>
                    {/* -------------------------------------- */}
                    
                    {/* --- 2. DETAILS & METRICS --- */}
                    <div className="flex-1 min-w-0 col-span-1 pt-1">
                      <p className="font-bold text-lg capitalize flex items-center gap-2">
                        {enhancement.enhancementType?.replace(/_/g, " ")}
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            enhancement.status === "completed"
                              ? "bg-chart-3/10 text-chart-3"
                              : enhancement.status === "failed"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-chart-4/10 text-chart-4"
                          } font-normal`}
                        >
                          {enhancement.status}
                          {(enhancement.status === "processing" || enhancement.status === "pending") && (
                            <Loader2 className="w-3 h-3 ml-1 inline-block animate-spin" />
                          )}
                        </span>
                      </p>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(enhancement.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* --- PROGRESS BAR FOR PROCESSING --- */}
                      {enhancement.status === "processing" ? (
                          <div className="space-y-2 mt-3">
                              <div className="flex justify-between text-sm">
                                  <p className="font-medium">AI Processing...</p>
                                  <p>{enhancement.processingProgress || 0}%</p> 
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                      className="h-full bg-primary transition-all duration-500"
                                      style={{ width: `${enhancement.processingProgress || 0}%` }}
                                  />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                  Updating every 5 seconds.
                              </p>
                          </div>
                      ) : enhancement.status === "completed" ? (
                        // Display Metrics when completed
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                            <MetricLabel value={enhancement.enhancedResolution || 'N/A'} label="Resolution" />
                            <MetricLabel value={formatMetric(enhancement.psnr, 2)} label="PSNR (dB)" />
                            <MetricLabel value={formatMetric(enhancement.ssim, 3)} label="SSIM" />
                            <MetricLabel value={formatMetric(enhancement.mae, 3)} label="MAE" />
                        </div>
                      ) : enhancement.status === "failed" ? (
                        <p className="text-sm text-destructive mt-3">
                           Processing failed. {enhancement.errorMessage || 'Please try again.'}
                        </p>
                      ) : (
                        <div className="text-sm text-muted-foreground mt-3 flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Job Queued...
                        </div>
                      )}
                    </div>
                    {/* -------------------------------------- */}
                    
                    {/* --- 3. DOWNLOAD & COMPARE BUTTONS --- */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:self-center md:justify-self-end col-span-1">
                        {enhancement.status === "completed" && enhancement.enhancedImageUrl && (
                            <>
                                {/* New Compare Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedEnhancement(enhancement)}
                                >
                                    <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                                    Compare
                                </Button>
                                
                                <a
                                    href={enhancement.enhancedImageUrl}
                                    download
                                    data-testid={`button-download-${index}`}
                                >
                                    <Button size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </a>
                            </>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No enhancements yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first image to get started
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* -------------------------------------------------- */}
      {/* 🟢 SIDE-BY-SIDE COMPARISON DIALOG */}
      {/* -------------------------------------------------- */}
      <Dialog open={!!selectedEnhancement} onOpenChange={() => setSelectedEnhancement(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
                Comparison: <span className="capitalize text-primary">{selectedEnhancement?.enhancementType?.replace(/_/g, " ")}</span>
            </DialogTitle>
            <DialogDescription>
                Side-by-side view and AI performance metrics.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEnhancement && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              
              {/* === LEFT COLUMN: ORIGINAL IMAGE === */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Original Image</h3>
                
                <div className="bg-muted rounded-lg overflow-hidden border">
                  <img 
                    src={selectedEnhancement.originalImageUrl ?? undefined} 
                    alt="Original" 
                    className="w-full h-auto object-contain" 
                    // Add error logging here for debugging data URL issues
                    onError={() => console.error("Original Image failed to load in modal. Check backend data.")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 p-4 border rounded-lg">
                    <MetricLabel value={selectedEnhancement.originalResolution || 'N/A'} label="Resolution" />
                    <MetricLabel value="N/A" label="PSNR (Reference)" />
                    <MetricLabel value="N/A" label="SSIM (Reference)" />
                    <MetricLabel value="N/A" label="MAE (Reference)" />
                </div>
              </div>

              {/* === RIGHT COLUMN: ENHANCED IMAGE === */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Enhanced Image</h3>
                
                <div className="bg-primary-100 rounded-lg overflow-hidden border-2 border-primary">
                  <img 
                    src={selectedEnhancement.enhancedImageUrl ?? undefined} 
                    alt="Enhanced" 
                    className="w-full h-auto object-contain" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 p-4 border border-primary/50 bg-primary/5 rounded-lg">
                    <MetricLabel value={selectedEnhancement.enhancedResolution || 'N/A'} label="Resolution" />
                    <MetricLabel value={formatMetric(selectedEnhancement.psnr, 2)} label="PSNR (dB)" />
                    <MetricLabel value={formatMetric(selectedEnhancement.ssim, 3)} label="SSIM" />
                    <MetricLabel value={formatMetric(selectedEnhancement.mae, 3)} label="MAE" />
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center">
             {selectedEnhancement?.enhancedImageUrl && (
                <a href={selectedEnhancement.enhancedImageUrl} download>
                    <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download Enhanced Image
                    </Button>
                </a>
             )}
          </div>
          
        </DialogContent>
      </Dialog>
      
    </div>
  );
}