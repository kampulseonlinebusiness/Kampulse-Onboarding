import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { PageSEO } from "@/components/PageSEO";

export function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="Privacy Policy"
        description="Learn how Kampulse Handling Solutions Ltd collects, uses, and protects your personal data in compliance with the Nigeria Data Protection Regulation (NDPR) and NDPA 2023."
        canonicalPath="/privacy-policy"
      />
      <section className="py-16 bg-background/75 backdrop-blur-sm min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-10">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium mb-4 text-muted-foreground">
              Legal
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: July 2026</p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

            <div>
              <p>
                Kampulse Handling Solutions Ltd ("Kampulse", "we", "us", "our") is committed to
                protecting the privacy and personal data of everyone who uses this recruitment portal.
                This Privacy Policy explains what information we collect, why we collect it, how we
                use it, and your rights under the Nigeria Data Protection Regulation (NDPR) and the
                Nigeria Data Protection Act (NDPA) 2023.
              </p>
              <p className="mt-3">
                By submitting an application through this portal, you confirm that you have read and
                understood this policy and consent to the processing of your personal data as described.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Who We Are</h2>
              <p>
                Kampulse Handling Solutions Ltd is the data controller responsible for your personal
                information collected through this portal.
              </p>
              <div className="mt-3 p-5 bg-card border rounded-xl text-sm space-y-1">
                <p className="font-semibold text-foreground">Kampulse Handling Solutions Ltd</p>
                <p>No. 9 Ricardo Oguma Close, Opposite Osubi Airport, Delta State, Nigeria</p>
                <p>
                  Email:{" "}
                  <a href="mailto:info@kampulse.com" className="text-primary hover:underline">
                    info@kampulse.com
                  </a>
                </p>
                <p>Phone: +234 704 062 1103</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Data We Collect</h2>
              <p>When you submit a job application through this portal, we collect:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><span className="font-medium text-foreground">Personal identifiers</span> — full name, date of birth, gender, nationality.</li>
                <li><span className="font-medium text-foreground">Contact information</span> — phone number, email address, residential address.</li>
                <li><span className="font-medium text-foreground">Identity documents</span> — a copy of your government-issued ID (National ID, Voters' Card, International Passport, or Driver's Licence).</li>
                <li><span className="font-medium text-foreground">Employment history</span> — previous employers, job titles, and reasons for leaving.</li>
                <li><span className="font-medium text-foreground">Guarantor details</span> — name, relationship, contact details, and address of your nominated guarantor.</li>
                <li><span className="font-medium text-foreground">Application materials</span> — cover letter, answers to screening questions, and any supporting documents you upload.</li>
                <li><span className="font-medium text-foreground">Technical data</span> — browser type and IP address, collected automatically when you access the portal (used for security and fraud prevention only).</li>
              </ul>
              <p className="mt-3">
                We do not collect sensitive data such as health information, religious beliefs, or
                political affiliation unless it is directly relevant to a specific role and you provide
                it voluntarily.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Why We Collect It</h2>
              <p>Your data is collected and processed for the following purposes:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>To assess your suitability for employment positions at Kampulse or our client organisations.</li>
                <li>To verify your identity and the accuracy of information provided in your application.</li>
                <li>To contact you about your application status, interview scheduling, and employment offers.</li>
                <li>To conduct background and guarantor verification as part of our standard recruitment process.</li>
                <li>To comply with our legal obligations as an employer and staffing company under Nigerian law.</li>
                <li>To maintain records required for employment contracts and workforce management.</li>
              </ul>
              <p className="mt-3">
                The legal basis for processing your data is <strong>consent</strong> (given when you
                submit your application) and <strong>legitimate interest</strong> (carrying out our
                recruitment and staffing business). Where an employment contract is offered, processing
                also becomes necessary for <strong>performance of that contract</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. How Long We Keep Your Data</h2>
              <p>
                We retain your application data for a maximum of <strong>12 months</strong> from the
                date of your application. If you are successfully placed in a role, your data will be
                retained for the duration of your employment and for 6 years thereafter, in accordance
                with Nigerian employment law record-keeping requirements.
              </p>
              <p className="mt-3">
                After the retention period expires, your data is securely deleted from our systems.
                You may request earlier deletion at any time — see Section 6 (Your Rights).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Who We Share Your Data With</h2>
              <p>Your personal data may be shared with:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>
                  <span className="font-medium text-foreground">Client employers</span> — where your application is being considered for a placement with a Kampulse client, we will share relevant portions of your application with that employer. We will inform you before doing so.
                </li>
                <li>
                  <span className="font-medium text-foreground">Background verification services</span> — third parties used to verify guarantor information or employment history, operating under strict confidentiality agreements.
                </li>
                <li>
                  <span className="font-medium text-foreground">Technology service providers</span> — cloud hosting and database providers that process data on our behalf under data processing agreements.
                </li>
                <li>
                  <span className="font-medium text-foreground">Regulatory authorities</span> — government bodies or law enforcement where we are legally required to disclose information.
                </li>
              </ul>
              <p className="mt-3">
                We do not sell your personal data to any third party for marketing or commercial
                purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
              <p>
                Under the NDPR and NDPA 2023, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><span className="font-medium text-foreground">Right to access</span> — you may request a copy of the personal data we hold about you.</li>
                <li><span className="font-medium text-foreground">Right to rectification</span> — you may ask us to correct inaccurate or incomplete information.</li>
                <li><span className="font-medium text-foreground">Right to erasure</span> — you may request that we delete your personal data, subject to any legal retention obligations.</li>
                <li><span className="font-medium text-foreground">Right to withdraw consent</span> — where processing is based on consent, you may withdraw it at any time. Withdrawal does not affect the lawfulness of processing before withdrawal.</li>
                <li><span className="font-medium text-foreground">Right to object</span> — you may object to processing carried out on the basis of legitimate interest.</li>
                <li><span className="font-medium text-foreground">Right to lodge a complaint</span> — you may lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe your data has been mishandled.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{" "}
                <a href="mailto:info@kampulse.com" className="text-primary hover:underline">
                  info@kampulse.com
                </a>
                . We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Data Security</h2>
              <p>
                We implement appropriate technical and organisational measures to protect your personal
                data against unauthorised access, loss, or disclosure. These include encrypted
                connections (HTTPS), access controls, and regular security reviews of our systems.
              </p>
              <p className="mt-3">
                Uploaded identity documents are stored in a restricted access file store and are only
                accessible to authorised Kampulse recruitment staff.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Cookies</h2>
              <p>
                This portal does not use tracking or advertising cookies. We use only essential
                session-management data to keep you logged in during your application session. No
                personal data is shared with advertisers or analytics platforms through cookies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the
                "Last updated" date at the top of this page. We encourage you to review this policy
                periodically. Continued use of the portal after changes are posted constitutes
                acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or how your data is
                handled, please contact us:
              </p>
              <div className="mt-3 p-5 bg-card border rounded-xl text-sm space-y-1">
                <p className="font-semibold text-foreground">Kampulse Handling Solutions Ltd — Data Privacy</p>
                <p>No. 9 Ricardo Oguma Close, Opposite Osubi Airport, Delta State, Nigeria</p>
                <p>
                  Email:{" "}
                  <a href="mailto:info@kampulse.com" className="text-primary hover:underline">
                    info@kampulse.com
                  </a>
                </p>
                <p>Phone: +234 704 062 1103</p>
              </div>
              <p className="mt-4 text-sm">
                You may also contact the{" "}
                <a
                  href="https://ndpc.gov.ng"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary hover:underline"
                >
                  Nigeria Data Protection Commission (NDPC)
                </a>{" "}
                if you wish to make a formal complaint about our data handling practices.
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm">
                See also our{" "}
                <Link href="/disclaimer" className="text-primary hover:underline">
                  Disclaimer
                </Link>
                {" "}for general legal information about this portal.
              </p>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
