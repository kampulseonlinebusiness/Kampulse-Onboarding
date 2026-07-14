import React from "react";
import { Link, useLocation } from "wouter";
import { Briefcase, Building, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Open Positions" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Building className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Kampulse
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/jobs" className="inline-flex">
              <Button size="sm" className="gap-2">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <ThemeToggle className="text-muted-foreground hover:text-foreground" />
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/90 backdrop-blur px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button className="w-full justify-center">Apply Now</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <WhatsAppButton />

      <footer className="border-t bg-background/70 backdrop-blur py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground">
                <Building className="w-3 h-3" />
              </div>
              <span className="font-bold text-base">Kampulse Handling Solutions Ltd</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Building careers, empowering businesses, and creating innovative solutions for the future of work.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Open Positions</Link></li>
              <li><span className="text-muted-foreground/60 cursor-default">Business Solutions</span></li>
              <li><span className="text-muted-foreground/60 cursor-default">About Us</span></li>
              <li><span className="text-muted-foreground/60 cursor-default">Contact</span></li>
              <li><Link href="/admin/login" className="text-muted-foreground hover:text-foreground transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Recruitment &amp; Staffing</li>
              <li>Workforce Management</li>
              <li>Business Process Support</li>
              <li>Technology Solutions</li>
              <li>Digital Transformation</li>
              <li>AI &amp; Automation Solutions</li>
              <li>Business Consulting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Lagos, Nigeria</li>
              <li>
                <a href="mailto:info@kampulse.com" className="hover:text-foreground transition-colors">
                  info@kampulse.com
                </a>
              </li>
              <li>+234 XXX XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-10 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Kampulse Handling Solutions Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
