import React, { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  useListAdminJobs,
  useCreateAdminJob,
  useUpdateAdminJob,
  getListAdminJobsQueryKey,
  getListJobsQueryKey,
  Job,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Pencil, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary is required"),
  workingHours: z.string().min(1, "Working hours are required"),
  transportAllowance: z.string().optional(),
  overtime: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "closed"]),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormDialogProps {
  open: boolean;
  onClose: () => void;
  job?: Job | null;
}

function JobFormDialog({ open, onClose, job }: JobFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createJob = useCreateAdminJob();
  const updateJob = useUpdateAdminJob();
  const isEditing = !!job;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title || "",
      location: job?.location || "",
      salary: job?.salary || "",
      workingHours: job?.workingHours || "",
      transportAllowance: job?.transportAllowance || "",
      overtime: job?.overtime || "",
      description: job?.description || "",
      status: (job?.status as "active" | "closed") || "active",
    },
  });

  // Reset form when dialog opens with different job
  React.useEffect(() => {
    if (open) {
      form.reset({
        title: job?.title || "",
        location: job?.location || "",
        salary: job?.salary || "",
        workingHours: job?.workingHours || "",
        transportAllowance: job?.transportAllowance || "",
        overtime: job?.overtime || "",
        description: job?.description || "",
        status: (job?.status as "active" | "closed") || "active",
      });
    }
  }, [open, job]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListAdminJobsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
  };

  const onSubmit = (values: JobFormValues) => {
    const data = {
      title: values.title,
      location: values.location,
      salary: values.salary,
      workingHours: values.workingHours,
      transportAllowance: values.transportAllowance || undefined,
      overtime: values.overtime || undefined,
      description: values.description || undefined,
      status: values.status,
    };

    if (isEditing && job) {
      updateJob.mutate({ id: job.id, data }, {
        onSuccess: () => {
          toast({ title: "Job Updated", description: `"${values.title}" has been updated.` });
          invalidate();
          onClose();
        },
        onError: (err: any) => {
          toast({ title: "Update Failed", description: err.message || "Something went wrong.", variant: "destructive" });
        },
      });
    } else {
      createJob.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Job Created", description: `"${values.title}" is now live.` });
          invalidate();
          onClose();
        },
        onError: (err: any) => {
          toast({ title: "Create Failed", description: err.message || "Something went wrong.", variant: "destructive" });
        },
      });
    }
  };

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Job Vacancy" : "Create New Job Vacancy"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Job Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Betshop Cashier" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="e.g. Osubi, Delta State" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="salary" render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl><Input placeholder="e.g. ₦65,000/month" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="workingHours" render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Hours</FormLabel>
                  <FormControl><Input placeholder="e.g. Mon–Sat, 8am–6pm" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="transportAllowance" render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Allowance <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="e.g. ₦5,000/month" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="overtime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Overtime <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="e.g. ₦500/hour" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active — publicly visible</SelectItem>
                      <SelectItem value="closed">Closed — hidden from public</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Role summary, responsibilities, and requirements..."
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isEditing ? "Save Changes" : "Create Job"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminJobs() {
  const { data: jobs, isLoading } = useListAdminJobs();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const openCreate = () => {
    setSelectedJob(null);
    setDialogOpen(true);
  };

  const openEdit = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Vacancies</h1>
            <p className="text-muted-foreground mt-1">Manage all job listings. Active listings appear on the public jobs page.</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> New Vacancy
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-card">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vacancies yet</h3>
            <p className="text-muted-foreground mb-4">Create your first job listing to start receiving applications.</p>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> New Vacancy</Button>
          </div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Salary</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Created</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job.id} className={`border-b last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                    <td className="p-4">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 md:hidden">{job.location}</div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{job.location}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{job.salary}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">
                      {job.createdAt ? format(new Date(job.createdAt), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="p-4">
                      <Badge variant={job.status === "active" ? "default" : "secondary"} className="capitalize">
                        {job.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => openEdit(job)}
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <JobFormDialog open={dialogOpen} onClose={closeDialog} job={selectedJob} />
    </AdminLayout>
  );
}
