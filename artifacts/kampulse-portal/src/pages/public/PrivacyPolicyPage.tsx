import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Database,
  Clock,
  UserCheck,
  Eye,
  Users,
  Share2,
  Lock,
  Cookie,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  FileText,
} from "lucide-react";

const highlights = [
  {
    icon: Database,
    title: "What We Collect",
    desc: "Name, contact details, date of birth, ID documents, employment history, and guarantor information submitted through your application.",
  },
  {
    icon: UserCheck,
    title: "Why We Collect It",
    desc: "Solely to assess your application, verify your identity, and manage the recruitment process. Never sold or used for marketing.",
  },
  {
    icon: Clock,
    title: "How Long We Keep It",
    desc: "Application data is retained for 12 months. If you're hired, records are kept for 6 years in line with Nigerian employment law.",
  },
  {
    icon: ShieldCheck,
    title: "Your Rights",
    desc: "You have the right to access, correct, or delete your data at any time. Email us at info@kampulse.com and we'll respond within 30 days.",
  },
];

const sections = [
  {
    icon: Users,
    title: "Who We Are",
    body: "Kampulse Handling Solutions Ltd is the data controller responsible for personal information collected through this recruitment portal. We are committed to protecting your privacy and handling your data responsibly in accordance with the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act (NDPA) 2023.",
    extra: null,
  },
  {
    icon: Database,
    title: "Data We Collect",
    body: "When you submit a job application through this portal, we collect the following categories of personal data:",
    list: [
      "Personal identifiers — full name, date of birth, gender, nationality.",
      "Contact information — phone number, email address, residential address.",
      "Identity documents — a copy of your government-issued ID (National ID, Voters' Card, International Passport, or Driver's Licence).",
      "Employment history — previous employers, job titles, and reasons for leaving.",
      "Guarantor details — name, relationship, contact details, and address of your nominated guarantor.",
      "Application materials — cover letter, answers to screening questions, and any supporting documents you upload.",
      "Technical data — browser type and IP address, collected automatically for security and fraud prevention only.",
    ],
    note: "We do not collect sensitive data such as health information, religious beliefs, or political affiliation unless it is directly relevant to a specific role and you provide it voluntarily.",
  },
  {
    icon: Eye,
    title: "Why We Collect It",
    body: "Your data is collected and processed for the following purposes:",
    list: [
      "To assess your suitability for employment positions at Kampulse or our client organisations.",
      "To verify your identity and the accuracy of information provided in your application.",
      "To contact you about your application status, interview scheduling, and employment offers.",
      "To conduct background and guarantor verification as part of our standard recruitment process.",
      "To comply with our legal obligations as an employer and staffing company under Nigerian law.",
      "To maintain records required for employment contracts and workforce management.",
    ],
    note: "The legal basis for processing is consent (given when you submit your application), legitimate interest (carrying out our recruitment business), and — where a contract is offered — performance of that contract.",
  },
  {
    icon: Clock,
    title: "How Long We Keep Your Data",
    body: "We retain your application data for a maximum of 12 months from the date of submission. If you are successfully placed in a role, your data will be retained for the duration of your employment and for 6 years thereafter, in line with Nigerian employment law record-keeping requirements. After the retention period, your data is securely deleted. You may request earlier deletion at any time — see Your Rights below.",
    list: null,
  },
  {
    icon: Share2,
    title: "Who We Share Your Data With",
    body: "Your personal data may be shared with:",
    list: [
      "Client employers — where your application is being considered for a placement. We will inform you before sharing.",
      "Background verification services — third parties used to verify guarantor information or employment history, under strict confidentiality agreements.",
      "Technology service providers — cloud hosting and database providers processing data on our behalf under data processing agreements.",
      "Regulatory authorities — government bodies or law enforcement where legally required.",
    ],
    note: "We do not sell your personal data to any third party for marketing or commercial purposes.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    body: "Under the NDPR and NDPA 2023, you have the following rights:",
    list: [
      "Right to access — request a copy of the personal data we hold about you.",
      "Right to rectification — ask us to correct inaccurate or incomplete information.",
      "Right to erasure — request that we delete your personal data, subject to legal retention obligations.",
      "Right to withdraw consent — where processing is based on consent, you may withdraw it at any time.",
      "Right to object — object to processing carried out on the basis of legitimate interest.",
      "Right to complain — lodge a complaint with the Nigeria Data Protection Commission (NDPC).",
    ],
    note: null,
  },
  {
    icon: Lock,
    title: "Data Security",
    body: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include encrypted connections (HTTPS), access controls, and regular security reviews. Uploaded identity documents are stored in a restricted-access file store accessible only to authorised Kampulse recruitment staff.",
    list: null,
  },
  {
    icon: Cookie,
    title: "Cookies",
    body: "This portal does not use tracking or advertising cookies. We use only essential session-management data to keep you logged in during your application session. No personal data is shared with advertisers or analytics platforms through cookies.",
    list: null,
  },
  {
    icon: RefreshCw,
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. When we do, we will revise the 'Last updated' date at the top of this page. Continued use of the portal after changes are posted constitutes acceptance of the revised policy.",
    list: null,
  },
];

export function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="Privacy Policy"
        description="Learn how Kampulse Handling Solutions Ltd collects, uses, and protects your personal data in compliance with the Nigeria Data Protection Regulation (NDPR) and NDPA 2023."
        canonicalPath="/privacy-policy"
      />

      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium mb-6">
            Privacy &amp; Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            We are committed to protecting your personal data. This policy explains exactly what
            we collect, why we collect it, and the rights you hold under the Nigeria Data
            Protection Act (NDPA) 2023.
          </p>
          <p className="text-sm text-primary-foreground/60 mt-4">Last updated: July 2026</p>
        </div>
      </section>

      {/* Four highlight cards */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">At a Glance</h2>
            <p className="text-muted-foreground text-lg">
              The key things you should know about how Kampulse handles your personal data.
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

      {/* Full policy sections */}
      <section className="py-20 bg-muted/20 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Full Privacy Policy</h2>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={s.title} className="bg-card border rounded-2xl p-8 shadow-sm flex gap-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg mb-3">
                    {i + 1}. {s.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                  {s.list && (
                    <ul className="mt-4 space-y-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-muted-foreground text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.note && (
                    <p className="mt-4 text-sm text-muted-foreground/80 italic border-l-2 border-primary/30 pl-4">
                      {s.note}
                    </p>
                  )}
                  {s.title === "Your Rights" && (
                    <a
                      href="https://ndpc.gov.ng"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-primary text-sm mt-4 hover:underline"
                    >
                      Visit the Nigeria Data Protection Commission <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Exercise Your Rights</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To access, correct, or request deletion of your personal data — or to ask any
                question about how we handle your information — reach out to us directly. We
                respond to all data requests within 30 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a href="mailto:info@kampulse.com">
                  <Button size="lg" className="gap-2">
                    Email Us <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Link href="/disclaimer">
                  <Button size="lg" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Disclaimer
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-5">
              <p className="font-semibold text-foreground">Kampulse Handling Solutions Ltd — Data Privacy</p>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No. 9 Ricardo Oguma Close, Opposite Osubi Airport, Delta State, Nigeria
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:info@kampulse.com" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  info@kampulse.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+2347040621103" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  +234 704 062 1103
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
