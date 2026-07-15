import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, TrendingUp, Lightbulb, MapPin, Target } from "lucide-react";
import { StatsSection, StatDef } from "../../components/StatsSection";

const ABOUT_STATS: StatDef[] = [
  {
    value: 500,
    suffix: "+",
    label: "Professionals Engaged",
    sublabel: "Placed across multiple industries",
    Icon: Users,
    accent: {
      bar: "bg-blue-500",
      iconBg: "bg-blue-500/15",
      iconText: "text-blue-400",
      number: "text-blue-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(59,130,246,0.18) 0%, transparent 100%)",
    },
  },
  {
    value: 12,
    suffix: "",
    label: "States Reached",
    sublabel: "Nationwide presence in Nigeria",
    Icon: MapPin,
    accent: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-500/15",
      iconText: "text-emerald-400",
      number: "text-emerald-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(16,185,129,0.18) 0%, transparent 100%)",
    },
  },
  {
    value: 3,
    suffix: "+",
    label: "Years of Operation",
    sublabel: "Growing stronger every year",
    Icon: TrendingUp,
    accent: {
      bar: "bg-violet-500",
      iconBg: "bg-violet-500/15",
      iconText: "text-violet-400",
      number: "text-violet-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(139,92,246,0.18) 0%, transparent 100%)",
    },
  },
  {
    value: 100,
    suffix: "%",
    label: "Compliance Focused",
    sublabel: "Nigerian labour law aligned",
    Icon: ShieldCheck,
    accent: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-500/15",
      iconText: "text-amber-400",
      number: "text-amber-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(245,158,11,0.18) 0%, transparent 100%)",
    },
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    desc: "We operate with full transparency and ethical standards in every engagement — with candidates, clients, and partners.",
  },
  {
    icon: Users,
    title: "People First",
    desc: "Every individual we engage with is treated with respect, fairness, and professionalism regardless of role or background.",
  },
  {
    icon: TrendingUp,
    title: "Excellence",
    desc: "We set high standards for ourselves and support the organisations and candidates we work with to achieve the same.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We embrace technology and modern processes to deliver faster, smarter, and more effective workforce solutions.",
  },
];

export function AboutPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="About Us"
        description="Learn about Kampulse Handling Solutions Ltd — Nigeria's recruitment and business solutions company connecting talent with opportunity across the country since 2021."
        canonicalPath="/about"
      />
      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium mb-6">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Building Careers & Empowering Businesses Across Nigeria
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Kampulse Handling Solutions Ltd is a Nigerian business solutions company committed to connecting
            exceptional talent with forward-thinking organisations, and building technology that powers
            the future of work.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To deliver exceptional workforce, technology, and business solutions that create sustainable
                value for individuals and organisations — bridging the gap between talented people and the
                opportunities that enable them to thrive.
              </p>
            </div>
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become one of Africa's leading business solutions companies, recognised for integrity,
                innovation, and an unwavering commitment to the growth of people and enterprises across
                the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-muted/20 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Who We Are</h2>
          <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
            <p>
              Kampulse Handling Solutions Ltd was founded with a clear purpose: to solve the persistent
              mismatch between available talent and the organisations that need them — and to build the
              digital infrastructure that makes Nigerian businesses more competitive.
            </p>
            <p>
              Our workforce division recruits, screens, and places professionals across multiple industries
              including hospitality, logistics, administration, technology, and customer service. We manage
              the full lifecycle from sourcing to onboarding, working as a trusted partner to both
              candidates and employers.
            </p>
            <p>
              Our technology division develops custom digital platforms, AI-powered automation solutions,
              and business intelligence tools that help organisations scale their operations more efficiently.
            </p>
            <p>
              Headquartered in Delta State, Nigeria, we serve clients and candidates across the country,
              with ambitions to expand our reach across West Africa and beyond.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-8 p-4 bg-card border rounded-xl text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            No. 9 Ricardo Oguma Close, Opposite Osubi Airport, Delta State, Nigeria
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">
              These principles guide every decision we make — from how we treat candidates to how we
              deliver solutions for our clients.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection stats={ABOUT_STATS} />

      {/* CTA */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to Work With Us?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Whether you're looking for your next career move or need a workforce and technology partner,
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <Button size="lg" className="gap-2">
                View Open Positions <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
