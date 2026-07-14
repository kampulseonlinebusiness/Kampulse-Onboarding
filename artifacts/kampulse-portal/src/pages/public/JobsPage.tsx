import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { useListJobs } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Banknote, Briefcase, ChevronRight } from "lucide-react";

export function JobsPage() {
  const { data: jobs, isLoading } = useListJobs();

  return (
    <PublicLayout>
      <div className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Open Positions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join Kampulse Handling Solutions and build a rewarding career. We are currently hiring for the following roles across our locations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border rounded-xl p-6 h-64 animate-pulse flex flex-col">
                <div className="w-24 h-6 bg-muted rounded-full mb-4"></div>
                <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
                <div className="w-1/2 h-8 bg-muted rounded mb-6"></div>
                <div className="mt-auto pt-4 border-t">
                  <div className="w-full h-10 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No open positions</h3>
            <p className="text-muted-foreground mb-6">We are not currently hiring for any roles. Please check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map((job) => (
              <div key={job.id} className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
                <div className="mb-6 flex-1">
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-4">
                    {job.location}
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{job.title}</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-muted-foreground">
                      <Banknote className="w-4 h-4 mr-3 shrink-0" />
                      <span className="font-medium text-foreground">{job.salary}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-3 shrink-0" />
                      <span>{job.workingHours}</span>
                    </div>
                    {job.transportAllowance && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-3 shrink-0" />
                        <span>Transport: {job.transportAllowance}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t mt-auto flex items-center justify-between">
                  <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    View Details
                  </Link>
                  <Link href={`/jobs/${job.id}`}>
                    <Button size="sm" className="gap-1">
                      Apply Now <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
