import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Cpu,
  BarChart3,
  Briefcase,
  Settings,
  Globe,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Recruitment & Staffing",
    desc: "End-to-end talent acquisition — from role scoping and candidate sourcing, through screening, verification, and onboarding. We place professionals across hospitality, logistics, administration, technology, and customer service.",
    bullets: [
      "Permanent and contract placements",
      "Bulk recruitment campaigns",
      "Executive and specialist search",
      "Onboarding and documentation support",
    ],
  },
  {
    icon: Briefcase,
    title: "Workforce Management",
    desc: "We manage deployed personnel on behalf of client organisations, handling compliance, performance, payroll processing, and HR administration so you can focus on your core business.",
    bullets: [
      "Staff deployment and supervision",
      "Payroll and benefits administration",
      "Compliance and legal documentation",
      "Performance tracking and reporting",
    ],
  },
  {
    icon: Cpu,
    title: "Technology Solutions",
    desc: "Custom software development, process automation, and digital platform builds tailored to the operational needs of Nigerian businesses and enterprises.",
    bullets: [
      "Custom web and mobile applications",
      "Business process automation",
      "AI-powered data tools",
      "Portal and platform development",
    ],
  },
  {
    icon: BarChart3,
    title: "Business Intelligence & Analytics",
    desc: "We help organisations make better decisions by turning raw operational data into structured insights, dashboards, and reports that drive measurable improvement.",
    bullets: [
      "KPI dashboards and reporting tools",
      "Operational data analysis",
      "Performance benchmarking",
      "Custom analytics implementation",
    ],
  },
  {
    icon: Settings,
    title: "Business Process Support",
    desc: "Operational consulting and hands-on support for businesses that need to streamline, restructure, or scale their internal processes efficiently.",
    bullets: [
      "Process mapping and optimisation",
      "Standard operating procedure design",
      "Organisational restructuring support",
      "Quality assurance frameworks",
    ],
  },
  {
    icon: Globe,
    title: "Digital Transformation",
    desc: "We guide organisations through structured digital adoption — from assessing current systems and identifying gaps to implementing solutions that modernise how the business operates.",
    bullets: [
      "Digital readiness assessment",
      "Technology adoption roadmaps",
      "System integration and migration",
      "Staff digital upskilling",
    ],
  },
];

const whyUs = [
  "Deep understanding of the Nigerian labour market and regulatory environment",
  "Proven ability to handle large-scale recruitment and workforce deployments",
  "In-house technology capability — we build what we recommend",
  "Responsive, relationship-driven account management",
  "Full compliance with Nigerian labour laws and corporate governance standards",
];

const PHASES = [
  {
    step: "01",
    title: "Discovery",
    desc: "We start with a detailed conversation to understand your business objectives, challenges, and requirements.",
    color: { bar: "bg-blue-500", glow: "rgba(59,130,246,0.12)", num: "text-blue-500/30" },
  },
  {
    step: "02",
    title: "Solution Design",
    desc: "Our team designs a tailored solution — workforce, technology, or consulting — with clear deliverables and timelines.",
    color: { bar: "bg-violet-500", glow: "rgba(139,92,246,0.12)", num: "text-violet-500/30" },
  },
  {
    step: "03",
    title: "Delivery & Support",
    desc: "We execute with discipline, keep you informed throughout, and remain available to support and adjust as your needs evolve.",
    color: { bar: "bg-emerald-500", glow: "rgba(16,185,129,0.12)", num: "text-emerald-500/30" },
  },
];

function HowWeWorkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-background/75 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">How We Work</h2>
          <p className="text-muted-foreground text-lg">
            A straightforward, structured engagement process designed to deliver value quickly.
          </p>
        </div>
        <div ref={ref} className="grid sm:grid-cols-3 gap-6">
          {PHASES.map((phase, i) => (
            <div
              key={phase.step}
              className="relative bg-card border rounded-2xl p-7 shadow-sm text-center overflow-hidden"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.55s ease ${i * 140}ms, transform 0.55s ease ${i * 140}ms`,
              }}
            >
              {/* subtle coloured top bar */}
              <span
                className={`absolute top-0 left-6 right-6 h-[2px] ${phase.color.bar} rounded-full`}
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.4s ease ${i * 140 + 350}ms`,
                }}
              />
              {/* ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 160px 80px at 50% 30%, ${phase.color.glow} 0%, transparent 100%)`,
                }}
              />
              <div className={`relative text-5xl font-extrabold ${phase.color.num} mb-4 tracking-tight`}>
                {phase.step}
              </div>
              <h3 className="relative font-bold text-lg mb-3">{phase.title}</h3>
              <p className="relative text-muted-foreground text-sm leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BusinessSolutionsPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="Business Solutions — Recruitment, Workforce &amp; Technology"
        description="Kampulse delivers end-to-end recruitment, staffing, workforce management, technology development, and business consulting solutions for growing Nigerian organisations."
        canonicalPath="/business-solutions"
      />
      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium mb-6">
            Business Solutions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Comprehensive Solutions for Growing Businesses
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            From workforce management and staffing to technology development and business consulting,
            Kampulse delivers integrated solutions that help Nigerian organisations operate more
            effectively and scale with confidence.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Our Services</h2>
            <p className="text-muted-foreground text-lg">
              Six integrated service areas designed to cover the full spectrum of business needs —
              from people to process to technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((s) => (
              <div key={s.title} className="bg-card border rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>
                <ul className="mt-auto space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kampulse */}
      <section className="py-20 bg-muted/20 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 tracking-tight">Why Partner With Kampulse?</h2>
          <div className="space-y-4">
            {whyUs.map((item) => (
              <div key={item} className="flex items-start gap-4 bg-card border rounded-xl p-5 shadow-sm">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <HowWeWorkSection />

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to Get Started?</h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Talk to our team about how Kampulse can support your business goals — whether you need
            workforce support, a technology solution, or both.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="ghost" className="bg-white text-gray-900 hover:bg-white/90 border-transparent font-semibold gap-2">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Learn About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
