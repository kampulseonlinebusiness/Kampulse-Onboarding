import React from "react";
import { Link } from "wouter";
import { resolveMediaUrl } from "@/lib/utils";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";
import { useListJobs } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Banknote, Briefcase, ChevronRight } from "lucide-react";

function JobCardSkeleton() {
  return (
    <div className="bg-card border rounded-2xl overflow-hidden animate-pulse flex flex-col shadow-sm">
      <div className="aspect-[16/9] bg-muted w-full" />
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="w-24 h-5 bg-muted rounded-full" />
        <div className="w-3/4 h-7 bg-muted rounded-lg" />
        <div className="space-y-2.5 mt-1">
          <div className="w-1/2 h-4 bg-muted rounded" />
          <div className="w-2/3 h-4 bg-muted rounded" />
        </div>
        <div className="mt-auto pt-4 border-t">
          <div className="w-full h-10 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: { id: number; title: string; location: string; salary: string; workingHours: string; transportAllowance?: string | null; overtime?: string | null; photoUrl?: string | null } }) {
  return (
    <div className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm">
      {/* Cover photo */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-muted">
        {job.photoUrl ? (
          <img
            src={resolveMediaUrl(job.photoUrl)}
            alt={`${job.title} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-primary/60" />
            </div>
          </div>
        )}
        {/* Location pill overlaid on photo */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-xl font-bold mb-4 text-foreground leading-snug group-hover:text-primary transition-colors">
          {job.title}
        </h2>

        <div className="space-y-2.5 mb-5 flex-1">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-semibold text-foreground">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>{job.workingHours}</span>
          </div>
          {job.transportAllowance && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              <span>Transport: {job.transportAllowance}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t space-y-2">
          <Link href={`/jobs/${job.id}`} className="block w-full">
            <Button
              className="w-full gap-2 font-semibold rounded-xl py-5 h-auto text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
            >
              Apply Now <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link
            href={`/jobs/${job.id}`}
            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}

export function JobsPage() {
  const { data: jobs, isLoading } = useListJobs();

  return (
    <PublicLayout>
      <PageSEO
        title="Open Positions"
        description="Browse current job vacancies at Kampulse Handling Solutions. Find roles in hospitality, logistics, administration, technology, and more across Nigeria. Apply online today."
        canonicalPath="/jobs"
      />
      {/* Hero banner */}
      <div className="bg-muted/30 py-14 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              Open Positions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Build Your Career<br className="hidden sm:block" /> with Kampulse
            </h1>
            <p className="text-lg text-muted-foreground">
              Join Kampulse Handling Solutions and build a rewarding career. We are currently hiring for the following roles across our locations.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No open positions right now</h3>
            <p className="text-muted-foreground">We are not currently hiring. Please check back later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
