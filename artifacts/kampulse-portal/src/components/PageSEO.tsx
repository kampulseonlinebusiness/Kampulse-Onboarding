import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Kampulse Handling Solutions Ltd";
const DEFAULT_IMAGE = "https://kampulseai.com/icons/icon-512.png";
const BASE_URL = "https://kampulseai.com";

interface PageSEOProps {
  /** Page-specific title. Will be rendered as "Title — Kampulse Handling Solutions". */
  title: string;
  /** Meta description — aim for 140–160 characters. */
  description: string;
  /** Canonical path, e.g. "/jobs" or "/jobs/42". Defaults to title-based canonical. */
  canonicalPath?: string;
  /** OG/Twitter image URL. Defaults to the Kampulse logo. */
  image?: string;
  /** OG type — "website" (default) or "article". */
  ogType?: "website" | "article";
}

/**
 * Drop-in per-page SEO component.  Place it as the first element inside the
 * page component (after the PublicLayout opening tag) so Helmet hoists it into
 * <head> and overrides the fallback tags in index.html.
 */
export function PageSEO({
  title,
  description,
  canonicalPath,
  image = DEFAULT_IMAGE,
  ogType = "website",
}: PageSEOProps) {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
