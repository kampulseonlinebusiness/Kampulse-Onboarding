import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function ApplicationSuccessPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Application Submitted!</h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Thank you for applying to Kampulse Handling Solutions. Your application has been successfully submitted and is currently under review by our HR team.
        </p>
        <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-6 mb-10 text-left">
          <h3 className="font-bold text-lg mb-2">What happens next?</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Our team will verify your uploaded documents.</li>
            <li>We will contact your guarantor for character verification.</li>
            <li>If your profile matches our requirements, we will reach out via email or phone to schedule an interview.</li>
          </ul>
        </div>
        <Link href="/">
          <Button size="lg">Return to Homepage</Button>
        </Link>
      </div>
    </PublicLayout>
  );
}
