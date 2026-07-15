import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a media URL returned by the API.
 *
 * - Absolute URLs (R2 CDN) are returned unchanged.
 * - Relative paths (local-disk fallback, e.g. /api/uploads/files/…)
 *   are prefixed with the API base URL so the browser fetches from
 *   kampulse-api.onrender.com, not the static site.
 */
export function resolveMediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
  return `${base}${url}`;
}
