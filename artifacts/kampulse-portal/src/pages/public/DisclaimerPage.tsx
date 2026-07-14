import React from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";

export function DisclaimerPage() {
  return (
    <PublicLayout>
      <section className="py-16 bg-background/75 backdrop-blur-sm min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-10">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium mb-4 text-muted-foreground">
              Legal
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Disclaimer</h1>
            <p className="text-muted-foreground">Last updated: July 2026</p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. General Information Only</h2>
              <p>
                The information contained on this website and recruitment portal is provided by
                Kampulse Handling Solutions Ltd ("Kampulse", "we", "us", "our") for general
                informational purposes only. While we make every effort to ensure the accuracy and
                currency of the content published here, we make no representations or warranties of
                any kind — express or implied — about the completeness, accuracy, reliability,
                suitability, or availability of any information, products, services, or related
                graphics contained on this site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Job Listings and Recruitment</h2>
              <p>
                All job listings published on this portal are subject to change at any time without
                prior notice. The inclusion of a position on this platform does not constitute a
                guarantee of employment. Kampulse acts as a recruitment and staffing intermediary and
                does not guarantee placement to any applicant. Employment offers, where made, will be
                communicated directly and formally by authorised Kampulse representatives.
              </p>
              <p className="mt-3">
                Applicants are advised to exercise due diligence and report any suspicious activity
                or fraudulent communications purportedly from Kampulse to our official contact channels.
                Kampulse will never request payment from candidates in exchange for job placement
                or consideration for any position.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, Kampulse Handling Solutions Ltd
                shall not be liable for any loss or damage — including, without limitation, indirect
                or consequential loss or damage, or any loss or damage whatsoever arising from loss
                of data, loss of profits, or any other loss arising from or in connection with the
                use of this portal or reliance on any information contained herein.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Third-Party Links</h2>
              <p>
                This website may contain links to third-party websites. These links are provided for
                your convenience to provide further information. We have no responsibility for the
                content of linked websites and the inclusion of any link does not imply our
                endorsement of that website or its operator.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Data and Privacy</h2>
              <p>
                Personal data submitted through this portal — including application forms, identification
                documents, and supporting materials — is collected and processed solely for legitimate
                recruitment and employment purposes. Kampulse is committed to protecting applicant
                privacy and handles all personal data in accordance with applicable Nigerian data
                protection regulations, including the Nigeria Data Protection Act (NDPA) 2023.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Governing Law</h2>
              <p>
                This disclaimer and any disputes arising out of or in connection with it shall be
                governed by and construed in accordance with the laws of the Federal Republic of
                Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the Nigerian
                courts.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Changes to This Disclaimer</h2>
              <p>
                Kampulse reserves the right to update or modify this disclaimer at any time. Continued
                use of this website following any changes constitutes acceptance of the revised
                disclaimer. We encourage you to review this page periodically.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Contact</h2>
              <p>
                If you have any questions regarding this disclaimer, please contact us at:
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

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
