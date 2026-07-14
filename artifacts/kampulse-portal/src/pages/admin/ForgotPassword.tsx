import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useForgotPassword } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const forgotMutation = useForgotPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: FormValues) => {
    forgotMutation.mutate({ data: values }, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err: any) => {
        toast({
          title: "Something went wrong",
          description: err.message || "Please try again later.",
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
          <h1 className="text-2xl font-bold tracking-tight mb-1">Reset Password</h1>
          <p className="text-muted-foreground text-sm">
            {submitted ? "Check your inbox" : "We'll send you a reset link"}
          </p>
        </div>

        <div className="p-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If that email is registered, you'll receive a password reset link shortly.
                The link expires in 1 hour.
              </p>
              <Link href="/admin/login">
                <Button variant="outline" className="w-full mt-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  <Button type="submit" className="w-full" size="lg" disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Send Reset Link
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <Link href="/admin/login">
                  <button className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3 h-3" />
                    Back to Sign In
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
