import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Users, 
  Building, 
  Briefcase,
  ShieldCheck,
  Award
} from "lucide-react";
import { useListJobs } from "@workspace/api-client-react";

export function HomePage() {
  const { data: jobs } = useListJobs();
  const recentJobs = jobs?.slice(0, 3) || [];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              Now hiring for multiple roles
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Build your career with <span className="text-blue-400">Kampulse</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
              We are Nigeria's premier workforce solutions company. Join our team and be part of a structured, professional environment that values your growth and contribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold w-full sm:w-auto">
                  View Open Positions <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 tracking-tight">About Kampulse Handling Solutions</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                Established with a vision to redefine workforce management in Nigeria, Kampulse Handling Solutions Ltd provides specialized personnel to top-tier organizations across the country.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                We believe that a company's greatest asset is its people. That's why we maintain rigorous standards in our recruitment process and ensure our employees are placed in environments where they can thrive, with clear expectations, competitive compensation, and structured support.
              </p>
              <div className="grid grid-cols-2 gap-6 border-t pt-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Employees</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">12</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">States Covered</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border shadow-xl relative">
                {/* Abstract corporate representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-100 flex items-center justify-center">
                   <Building className="w-32 h-32 text-primary/20" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl border shadow-lg max-w-xs">
                <div className="flex gap-4 items-start">
                  <div className="bg-green-100 p-3 rounded-full text-green-700">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Verified Employer</h4>
                    <p className="text-sm text-muted-foreground mt-1">Fully registered and compliant with Nigerian labor laws.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Why Work With Us</h2>
            <p className="text-muted-foreground text-lg">We provide a structured environment that respects your time, effort, and professional growth.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Clear Expectations",
                desc: "Every role comes with a detailed job description and a formal employment agreement so you know exactly what is expected."
              },
              {
                icon: Award,
                title: "Competitive Compensation",
                desc: "We offer fair basic salaries, regular transport allowances, and structured overtime compensation."
              },
              {
                icon: Users,
                title: "Professional Environment",
                desc: "We strictly enforce a code of conduct that ensures a safe, respectful workplace free from discrimination."
              }
            ].map((value, i) => (
              <div key={i} className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Process */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Our Recruitment Process</h2>
            <p className="text-muted-foreground text-lg">A transparent, structured path from application to employment.</p>
          </div>

          <div className="max-w-4xl mx-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {[
              { title: "Application Submission", desc: "Start by filling out our comprehensive online application form." },
              { title: "Document Verification", desc: "Upload required documents including ID, CV, and certificates securely." },
              { title: "Guarantor Checking", desc: "Provide details of a trusted guarantor to vouch for your character." },
              { title: "Initial Review", desc: "Our HR team reviews your complete profile against role requirements." },
              { title: "Interview", desc: "Selected candidates are invited for an interview to assess fit." },
              { title: "Employment Agreement", desc: "Review and digitally sign your formal employment contract." }
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8 last:mb-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted-foreground/20 text-muted-foreground group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm z-10">
                  {i + 1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-xl border shadow-sm">
                  <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Preview */}
      {recentJobs.length > 0 && (
        <section className="py-20 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Current Open Positions</h2>
                <p className="text-muted-foreground">Join our growing team today.</p>
              </div>
              <Link href="/jobs" className="hidden sm:inline-flex text-primary font-medium hover:underline items-center">
                View all roles <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {recentJobs.map(job => (
                <div key={job.id} className="bg-card border rounded-xl p-6 hover:shadow-md transition-all flex flex-col h-full">
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 mb-4 border border-blue-100">
                      {job.location}
                    </span>
                    <h3 className="font-bold text-xl mb-2">{job.title}</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{job.salary}</div>
                    <div className="text-sm text-muted-foreground mb-4">{job.workingHours}</div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t">
                    <Link href={`/jobs/${job.id}`} className="block w-full">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/jobs">
                <Button variant="outline" className="w-full">View all roles</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
