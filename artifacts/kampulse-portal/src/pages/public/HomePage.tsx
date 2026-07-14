import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Building,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Lightbulb,
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Building Careers.{" "}
              <span className="text-blue-400">Empowering Businesses.</span>{" "}
              Driving Innovation.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-4 max-w-2xl leading-relaxed">
              Kampulse Handling Solutions Ltd is building the future of work in Nigeria through workforce solutions, technology, business innovation, and digital transformation.
            </p>
            <p className="text-base md:text-lg text-primary-foreground/70 mb-10 max-w-2xl leading-relaxed">
              Whether you're looking for your next career opportunity or you're an organization searching for exceptional talent and innovative business solutions, we're here to help you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold w-full sm:w-auto">
                  Find Opportunities <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold w-full sm:w-auto">
                  View Open Positions
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
              <h2 className="text-3xl font-bold mb-6 tracking-tight">About Kampulse Handling Solutions Ltd</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                Kampulse Handling Solutions Ltd is a Nigerian business solutions company committed to helping individuals and organizations succeed through people, technology, and innovation.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                Our workforce division connects qualified professionals with reputable employers across multiple industries, while our technology division develops digital platforms and intelligent solutions that improve how businesses operate.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                From recruitment and staffing to automation, AI-powered solutions, digital products, and business support services, we are building solutions that prepare businesses for the future.
              </p>
              <p className="font-semibold text-foreground text-lg italic mb-8">
                "We believe sustainable growth happens when talented people meet innovative systems."
              </p>
              <div className="grid grid-cols-3 gap-4 border-t pt-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">500+</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Professionals Engaged</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">12</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">States Reached</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    <span className="text-lg font-bold text-primary">Innovation</span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight">Driven</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-tight">Building workforce and technology solutions for tomorrow.</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border shadow-xl relative">
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

      {/* Why Choose Kampulse Section */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Why Choose Kampulse?</h2>
            <p className="text-muted-foreground text-lg">We combine professionalism, innovation, and structured processes to create opportunities for people and sustainable value for businesses.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Professional Opportunities",
                desc: "Every role includes clear responsibilities, transparent expectations, and structured onboarding to help you succeed from day one."
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                desc: "We encourage continuous learning, professional development, and long-term career progression across our business divisions and partner organizations."
              },
              {
                icon: Cpu,
                title: "Technology-Driven",
                desc: "We leverage modern technology, digital platforms, and AI-powered systems to improve recruitment, workforce management, and business operations."
              },
              {
                icon: ShieldCheck,
                title: "Integrity & Trust",
                desc: "Our operations are built on transparency, accountability, compliance, and ethical business practices."
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
            <p className="text-muted-foreground text-lg">Our structured recruitment process ensures fairness, transparency, and quality for every applicant.</p>
          </div>

          <div className="max-w-4xl mx-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {[
              { title: "Online Application", desc: "Complete your application through our secure recruitment portal." },
              { title: "Document Verification", desc: "Submit your identification, qualifications, and supporting documents for verification." },
              { title: "Background & Guarantor Verification", desc: "We verify information provided to maintain trust and workplace security." },
              { title: "Application Assessment", desc: "Our recruitment team carefully evaluates your experience and suitability." },
              { title: "Interview & Evaluation", desc: "Qualified candidates participate in interviews and role-specific assessments." },
              { title: "Offer & Onboarding", desc: "Successful applicants receive a formal employment offer, complete documentation, and begin onboarding." }
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

      {/* Current Opportunities */}
      <section className="py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Current Opportunities</h2>
            <p className="text-muted-foreground text-lg">
              Explore available positions across our workforce network.
            </p>
            <p className="text-muted-foreground mt-2">
              Whether you're starting your career or seeking your next opportunity, Kampulse connects talented individuals with organizations that value excellence.
            </p>
          </div>

          {recentJobs.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-10">
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
              <div className="text-center">
                <Link href="/jobs">
                  <Button size="lg" className="gap-2">
                    View All Open Positions <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  View All Open Positions <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Looking Ahead — Vision Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0 60L60 0H30L0 30M60 60V30L30 60" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm font-medium mb-8">
            Looking Ahead
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            We're building more than a recruitment company.
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
            Our vision is to become one of Africa's leading business solutions companies by combining workforce excellence with innovative technology that helps businesses grow, creates employment opportunities, and improves lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xl font-semibold">
            <span className="text-primary-foreground/70">Today we recruit talent.</span>
            <span className="hidden sm:block text-primary-foreground/30">·</span>
            <span className="text-blue-300">Tomorrow we build the future of work.</span>
          </div>
          <div className="mt-10">
            <Link href="/jobs">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                Join Us Today <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
