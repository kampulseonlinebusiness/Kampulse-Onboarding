import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/2347040621103";

export function ContactPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="Contact Us"
        description="Get in touch with Kampulse Handling Solutions Ltd. Reach us by phone, email, or WhatsApp. We're based in Delta State, Nigeria and respond within one business day."
        canonicalPath="/contact"
      />
      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium mb-6">
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Whether you're a candidate exploring opportunities, an organisation looking for workforce
            or technology solutions, or a partner wanting to collaborate — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-20 bg-background/75 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Contact cards */}
            <div className="space-y-5">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Contact Information</h2>

              {/* Address */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-5 items-start">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    No. 9 Ricardo Oguma Close<br />
                    Opposite Osubi Airport<br />
                    Delta State, Nigeria
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-5 items-start">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+2347040621103"
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    +234 704 062 1103
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-5 items-start">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:info@kampulse.com"
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    info@kampulse.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-5 items-start">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#25D366" }}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Chat with us on WhatsApp
                  </a>
                  <p className="text-xs text-muted-foreground/70 mt-1">Quickest way to reach us</p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex gap-5 items-start">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Hours</h3>
                  <p className="text-muted-foreground text-sm">Monday – Friday: 8:00 AM – 5:00 PM</p>
                  <p className="text-muted-foreground text-sm">Saturday: 9:00 AM – 1:00 PM</p>
                  <p className="text-muted-foreground text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Right panel — reach-out guidance */}
            <div className="flex flex-col gap-6">
              <div className="bg-muted/30 border rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-5 tracking-tight">How Can We Help?</h2>
                <div className="space-y-6">
                  {[
                    {
                      label: "Job Seekers",
                      desc: "Browse our open positions on the Careers page and submit your application online. For questions about an active application, reach us via WhatsApp or email.",
                    },
                    {
                      label: "Employers & Organisations",
                      desc: "Looking to hire or need workforce management support? Send us an email or call us directly and our solutions team will follow up within one business day.",
                    },
                    {
                      label: "Technology & Business Solutions",
                      desc: "If you're interested in our technology services or business consulting offerings, email us a brief description of your needs and we'll schedule a discovery call.",
                    },
                    {
                      label: "Media & Partnerships",
                      desc: "For press enquiries, partnership proposals, or collaboration opportunities, please email info@kampulse.com with the subject line 'Partnership'.",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <h4 className="font-semibold text-sm mb-1">{item.label}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-center gap-3 rounded-2xl p-5 text-white font-semibold text-base shadow-md hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
