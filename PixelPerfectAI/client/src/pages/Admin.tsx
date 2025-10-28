// client/src/pages/Admin.tsx
// =============================================================
// Admin Dashboard Page
// -------------------------------------------------------------
// Author: Shruti Mandaokar
// Date: October 2025
//
// This page provides an admin interface to monitor system stats,
// recent users, and recent enhancements. Only accessible to
// users with admin privileges.
//
// Features:
//   - Redirect non-admin users with a toast notification
//   - Display key system stats (users, enhancements, credits, revenue)
//   - Show recent users and recent enhancement activity
//   - Responsive tables and loading placeholders
// =============================================================

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { User, Enhancement } from "@shared/schema";
import { Users, ImageIcon, TrendingUp, Loader2, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Admin Dashboard component
 * Displays system metrics, recent users, and recent enhancements
 */
export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAuthenticated, authLoading, user, toast]);

  // Fetch system statistics
  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalUsers: number;
    totalEnhancements: number;
    totalCreditsUsed: number;
    revenue: number;
  }>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  // Fetch list of users
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  // Fetch recent enhancement activities
  const { data: recentEnhancements, isLoading: enhancementsLoading } = useQuery<Enhancement[]>({
    queryKey: ["/api/admin/enhancements/recent"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  // Show loader while auth is being verified
  if (authLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor system performance and user activity
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl font-bold" data-testid="stat-total-users">
                    {statsLoading ? "..." : stats?.totalUsers || 0}
                  </p>
                </div>
                <Users className="w-10 h-10 text-primary" />
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Enhancements</p>
                  <p className="text-3xl font-bold" data-testid="stat-total-enhancements">
                    {statsLoading ? "..." : stats?.totalEnhancements || 0}
                  </p>
                </div>
                <ImageIcon className="w-10 h-10 text-chart-2" />
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credits Used</p>
                  <p className="text-3xl font-bold" data-testid="stat-credits-used">
                    {statsLoading ? "..." : stats?.totalCreditsUsed || 0}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-chart-3" />
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Revenue (MRR)</p>
                  <p className="text-3xl font-bold" data-testid="stat-revenue">
                    ${statsLoading ? "..." : (stats?.revenue || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-chart-4" />
              </div>
            </Card>
          </div>

          {/* Recent Users Table */}
          <Card className="p-6 mb-8 border-card-border">
            <h2 className="text-2xl font-bold mb-6">Recent Users</h2>
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 10).map((u, index) => (
                      <TableRow key={u.id} data-testid={`user-row-${index}`}>
                        <TableCell className="font-medium">
                          {u.firstName || u.lastName
                            ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                            : "Anonymous"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {u.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded capitalize">
                            {u.subscriptionTier}
                          </span>
                        </TableCell>
                        <TableCell>{u.credits}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No users yet</p>
            )}
          </Card>

          {/* Recent Enhancements Table */}
          <Card className="p-6 border-card-border">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            {enhancementsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : recentEnhancements && recentEnhancements.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Processing Time</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEnhancements.slice(0, 10).map((enhancement, index) => (
                      <TableRow key={enhancement.id} data-testid={`enhancement-row-${index}`}>
                        <TableCell className="font-medium capitalize">
                          {enhancement.enhancementType?.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              enhancement.status === "completed"
                                ? "bg-chart-3/10 text-chart-3"
                                : enhancement.status === "failed"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-chart-4/10 text-chart-4"
                            }`}
                          >
                            {enhancement.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {enhancement.modelUsed || "N/A"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {enhancement.processingTime
                            ? `${(enhancement.processingTime / 1000).toFixed(1)}s`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(enhancement.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No enhancements yet
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
