import React from "react";
import { Link, useLocation, useParams } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { useGetJob } from "@workspace/api-client-react";
import { getGetJobQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Banknote, Calendar, ChevronRight } from "lucide-react";

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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-24"></div>
            <div className="h-16 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded w-full"></div>
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
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
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
          
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-6 pb-2 border-b">Position Overview</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary mt-0.5">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium mb-1">Basic Salary</div>
                    <div className="font-bold text-lg text-foreground">{job.salary}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium mb-1">Working Hours</div>
                    <div className="font-medium text-foreground">{job.workingHours}</div>
                  </div>
                </div>

                {job.transportAllowance && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-medium mb-1">Transport Allowance</div>
                      <div className="font-medium text-foreground">{job.transportAllowance}</div>
                    </div>
                  </div>
                )}

                {job.overtime && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary mt-0.5">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-medium mb-1">Overtime</div>
                      <div className="font-medium text-foreground">{job.overtime}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-200">Ready to apply?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">Our application process takes about 10-15 minutes to complete.</p>
              <Link href={`/apply/start/${job.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Application</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
