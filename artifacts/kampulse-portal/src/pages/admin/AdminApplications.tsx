import React, { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListAdminApplications } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Filter } from "lucide-react";
import { format } from "date-fns";

export function AdminApplications() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Simple debounce for search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useListAdminApplications({
    query: {
      queryKey: ["adminApplications", statusFilter, debouncedSearch],
    },
    request: {
      // Pass params manually as query params if generated hook expects it differently,
      // but Orval puts them in the fetch URL automatically if defined in the schema.
    }
  });

  // Client-side filtering if API doesn't fully support it yet
  const filteredApps = data?.applications?.filter(app => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (debouncedSearch && !app.applicantName?.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
    return true;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500 hover:bg-green-600 text-white">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'under_review': return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Under Review</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending</Badge>;
      default: return <Badge variant="secondary" className="capitalize">{status.replace('_', ' ')}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Applications</h1>
          <p className="text-muted-foreground">Manage and review all job applications.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search applicants..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No applications found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="font-medium text-foreground">{app.applicantName || "Anonymous Applicant"}</div>
                      <div className="text-xs text-muted-foreground">{app.applicantEmail || "No email provided"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{app.jobTitle}</div>
                      <div className="text-xs text-muted-foreground">Step {app.currentStep} of 6</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{format(new Date(app.createdAt), 'MMM d, yyyy')}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" /> Review
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination placeholder if needed */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between text-sm text-muted-foreground">
          Showing {filteredApps.length} applications
        </div>
      </div>
    </AdminLayout>
  );
}
