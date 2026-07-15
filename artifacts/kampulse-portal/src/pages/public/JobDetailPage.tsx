import React from "react";
import { Link, useParams } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { useGetJob } from "@workspace/api-client-react";
import { getGetJobQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Banknote, Calendar, ChevronRight, Briefcase } from "lucide-react";

export function JobDetailPage() {
  const params = useParams();
  const jobId = parseInt(params.id || "0", 10);

  const { data: job, isLoading, isError } = useGetJob(jobId, {
    query: {
      enabled: !!jobId,
      queryKey: getGetJobQueryKey(jobId),
    }
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="animate-pulse">
          {/* Photo skeleton */}
          <div className="w-full aspect-[21/9] bg-muted" />
          <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
            <div className="h-6 bg-muted rounded w-24" />
            <div className="h-14 bg-muted rounded w-3/4" />
            <div className="h-32 bg-muted rounded w-full" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !job) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-8">The position you are looking for does not exist or has been closed.</p>
          <Link href="/jobs">
            <Button>View Open Positions</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* ── Hero / Cover Photo ── */}
      {job.photoUrl ? (
        <div className="relative w-full aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={job.photoUrl}
            alt={`${job.title} cover`}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content overlaid on photo */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 max-w-4xl pb-8">
              <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-5 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
              </Link>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">{job.title}</h1>
                </div>
                <div className="shrink-0">
                  <Link href={`/apply/start/${job.id}`}>
                    <Button size="lg" className="w-full md:w-auto text-base px-7 py-5 h-auto shadow-xl bg-white text-primary hover:bg-white/90 gap-2">
                      Apply Now <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── No photo — standard muted header ── */
        <div className="bg-muted/30 py-10 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
            </Link>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">{job.title}</h1>
              </div>
              <div className="shrink-0">
                <Link href={`/apply/start/${job.id}`}>
                  <Button size="lg" className="w-full md:w-auto text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                    Apply for this position
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">

        {/* Back link when photo is shown (already in overlay above, show again below for accessibility) */}
        {job.photoUrl && (
          <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors md:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Link>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Job Description</h2>
              <div className="prose prose-blue max-w-none text-muted-foreground">
                {job.description ? (
                  <p className="whitespace-pre-wrap">{job.description}</p>
                ) : (
                  <p>Kampulse Handling Solutions Ltd is looking for a dedicated and professional {job.title} to join our team in {job.location}. The ideal candidate will be responsible for maintaining our high standards of service and operational efficiency.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Role Requirements</h2>
              <ul className="space-y-3 text-muted-foreground list-disc pl-5">
                <li>Proven ability to work in a structured, professional environment.</li>
                <li>Excellent communication and interpersonal skills.</li>
                <li>Commitment to following company policies and operational guidelines.</li>
                <li>Residency in or willingness to relocate to {job.location}.</li>
                <li>Valid identification and ability to provide a credible guarantor.</li>
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-6 pb-2 border-b">Position Overview</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-0.5">Basic Salary</div>
                    <div className="font-bold text-lg text-foreground">{job.salary}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-xl text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-0.5">Working Hours</div>
                    <div className="font-medium text-foreground">{job.workingHours}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-500/10 p-2 rounded-xl text-orange-600 dark:text-orange-400 mt-0.5 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-0.5">Location</div>
                    <div className="font-medium text-foreground">{job.location}</div>
                  </div>
                </div>

                {job.transportAllowance && (
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-xl text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Transport Allowance</div>
                      <div className="font-medium text-foreground">{job.transportAllowance}</div>
                    </div>
                  </div>
                )}

                {job.overtime && (
                  <div className="flex items-start gap-3">
                    <div className="bg-rose-500/10 p-2 rounded-xl text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Overtime</div>
                      <div className="font-medium text-foreground">{job.overtime}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-lg">
              <h3 className="font-bold text-lg mb-1">Ready to apply?</h3>
              <p className="text-sm text-primary-foreground/80 mb-5">Our application process takes about 10–15 minutes to complete.</p>
              <Link href={`/apply/start/${job.id}`}>
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold shadow-sm" size="lg">
                  Start Application <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
