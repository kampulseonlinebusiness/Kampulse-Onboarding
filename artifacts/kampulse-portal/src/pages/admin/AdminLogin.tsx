import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: (res) => {
        login({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
        });
        // Navigation is handled by the useEffect watching isAuthenticated above,
        // which fires after React commits the state update from login().
        toast({ title: "Login Successful", description: "Welcome back." });
      },
      onError: (err: any) => {
        toast({
          title: "Login Failed",
          description: err.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </a>
      <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b bg-muted/10">
          <img
            src="/images/kampulse-logo.png"
            alt="Kampulse Handling Solutions Ltd"
            className="h-20 w-auto mx-auto mb-4 rounded-xl object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight mb-1">Kampulse Admin</h1>
          <p className="text-muted-foreground text-sm">Sign in to manage the portal</p>
        </div>
        
        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@kampulse.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <Link href="/admin/forgot-password">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </button>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
