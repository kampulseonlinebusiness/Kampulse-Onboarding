import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  Scale,
  Globe,
  Lock,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const highlights = [
  {
    icon: Briefcase,
    title: "Job Listings",
    desc: "All positions listed are subject to change without notice and do not constitute a guarantee of employment. We act as a recruitment intermediary only.",
  },
  {
    icon: ShieldCheck,
    title: "No Fees — Ever",
    desc: "Kampulse will never request payment from any candidate in exchange for job placement, shortlisting, or consideration for any position.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    desc: "We are not liable for any loss arising from reliance on information published on this portal, including job listings, salary indications, or third-party content.",
  },
  {
    icon: Lock,
    title: "Data & Privacy",
    desc: "Personal data submitted through this portal is handled in accordance with the Nigeria Data Protection Act (NDPA) 2023 for recruitment purposes only.",
  },
];

const sections = [
  {
    icon: Globe,
    title: "General Information Only",
    body: "The information on this website is provided by Kampulse Handling Solutions Ltd for general informational purposes only. While we make every effort to keep content accurate and current, we make no representations or warranties — express or implied — about the completeness, reliability, or suitability of any information, products, or services described here.",
  },
  {
    icon: Briefcase,
    title: "Job Listings & Recruitment",
    body: "All job listings are subject to change at any time without prior notice. Inclusion of a position does not guarantee placement. Employment offers, where made, will be communicated directly and formally by authorised Kampulse representatives. Applicants are advised to report any suspicious communications purportedly from Kampulse to our official contact channels immediately.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by applicable law, Kampulse Handling Solutions Ltd shall not be liable for any loss or damage — including indirect or consequential loss — arising from use of this portal or reliance on any information contained herein, including but not limited to loss of data, loss of profits, or missed employment opportunities.",
  },
  {
    icon: Globe,
    title: "Third-Party Links",
    body: "This website may contain links to third-party websites for your convenience. We have no responsibility for the content of linked websites and inclusion of any link does not imply our endorsement of that website or its operator. We encourage you to read the privacy notices and terms of any external site you visit.",
  },
  {
    icon: Lock,
    title: "Data & Privacy",
    body: "Personal data submitted through this portal — including application forms, identification documents, and supporting materials — is collected and processed solely for legitimate recruitment and employment purposes in accordance with the Nigeria Data Protection Act (NDPA) 2023. For full details, please read our Privacy Policy.",
  },
  {
    icon: Scale,
    title: "Governing Law",
    body: "This disclaimer and any disputes arising out of or in connection with it shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the Nigerian courts.",
  },
  {
    icon: RefreshCw,
    title: "Changes to This Disclaimer",
    body: "Kampulse reserves the right to update or modify this disclaimer at any time. Continued use of this website following any changes constitutes acceptance of the revised disclaimer. We encourage you to review this page periodically for updates.",
  },
];

export function DisclaimerPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="Disclaimer"
        description="Read the legal disclaimer for Kampulse Handling Solutions Ltd, covering job listing accuracy, liability limitations, third-party links, and data handling on this recruitment portal."
        canonicalPath="/disclaimer"
      />

      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium mb-6">
            Legal Notice
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Disclaimer
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Please read this notice carefully before using our recruitment portal. It sets out
            the terms under which you access Kampulse's services and the limits of our liability.
          </p>
          <p className="text-sm text-primary-foreground/60 mt-4">Last updated: July 2026</p>
        </div>
      </section>

      {/* Key points grid */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Key Points to Know</h2>
            <p className="text-muted-foreground text-lg">
              A plain-English summary of the most important things this disclaimer covers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {highlights.map((h) => (
              <div key={h.title} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <h.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mb-2">{h.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed sections */}
      <section className="py-20 bg-muted/20 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Full Disclaimer</h2>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={s.title} className="bg-card border rounded-2xl p-8 shadow-sm flex gap-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3">
                    {i + 1}. {s.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                  {s.title === "Data & Privacy" && (
                    <Link href="/privacy-policy" className="inline-flex items-center gap-1 text-primary text-sm mt-3 hover:underline">
                      Read our Privacy Policy <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Questions?</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                If you have any questions about this disclaimer or anything else related to how
                we operate, our team is happy to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/contact">
                  <Button size="lg" className="gap-2">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/privacy-policy">
                  <Button size="lg" variant="outline">Privacy Policy</Button>
                </Link>
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Office Address</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    No. 9 Ricardo Oguma Close, Opposite Osubi Airport, Delta State, Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Email</p>
                  <a href="mailto:info@kampulse.com" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    info@kampulse.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Phone</p>
                  <a href="tel:+2347040621103" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    +234 704 062 1103
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
