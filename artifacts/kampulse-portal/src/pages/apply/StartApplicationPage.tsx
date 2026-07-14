import React from "react";
import { Link, useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { useGetJob, useStartApplication } from "@workspace/api-client-react";
import { getGetJobQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Briefcase, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  expectedStartDate: z.string().min(1, "Expected start date is required"),
  applicationSource: z.string().min(1, "Please select how you heard about us"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function StartApplicationPage() {
  const params = useParams();
  const jobId = parseInt(params.jobId || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: job, isLoading: isLoadingJob } = useGetJob(jobId, {
    query: {
      enabled: !!jobId,
      queryKey: getGetJobQueryKey(jobId),
    }
  });

  const startApplication = useStartApplication();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expectedStartDate: "",
      applicationSource: "",
      coverLetter: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startApplication.mutate({
      data: {
        jobId,
        ...values,
      }
    }, {
      onSuccess: (data) => {
        toast({
          title: "Application Started",
          description: "Your application has been initialized securely.",
        });
        setLocation(`/apply/${data.token}`);
      },
      onError: (err: any) => {
        toast({
          title: "Error starting application",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoadingJob) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!job) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <Link href="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href={`/jobs/${job.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Job Details
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Start Your Application</h1>
          <div className="flex items-center text-muted-foreground gap-4">
            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> {job.title}</span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {job.location}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Initial Information</h2>
            <p className="text-muted-foreground text-sm">Please provide your starting availability and a brief cover letter. You will be able to fill out your full personal details in the next steps.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="expectedStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Job Board">Job Board</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Walk-in">Walk-in</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us why you are a great fit for this role..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 border-t flex justify-end">
                <Button type="submit" size="lg" disabled={startApplication.isPending}>
                  {startApplication.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Continue Application
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PublicLayout>
  );
}
