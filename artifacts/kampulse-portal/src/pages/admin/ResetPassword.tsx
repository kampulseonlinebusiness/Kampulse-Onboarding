import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Loader2, ArrowLeft } from "lucide-react";
import { useResetPassword } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const resetMutation = useResetPassword();

  // Extract token from query string
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const token = params.get("token") ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-xl font-bold mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground text-sm mb-6">
              This password reset link is missing required information. Please request a new one.
            </p>
            <Link href="/admin/forgot-password">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Request a New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    resetMutation.mutate({ data: { token, newPassword: values.newPassword } }, {
      onSuccess: () => {
        toast({
          title: "Password Reset",
          description: "Your password has been updated. Please sign in.",
        });
        setLocation("/admin/login");
      },
      onError: (err: any) => {
        toast({
          title: "Reset Failed",
          description: err.message || "This link may have expired. Please request a new one.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b bg-muted/10">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mx-auto mb-4 shadow-sm">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Set New Password</h1>
          <p className="text-muted-foreground text-sm">Choose a strong password for your account</p>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Reset Password
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <Link href="/admin/login">
              <button className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
