import React from "react";

interface KampulseLogoProps {
  /** Pass Tailwind / CSS classes to control size, e.g. "h-14 w-auto" */
  className?: string;
}

/**
 * Inline SVG logo — theme-aware.
 *
 * The icon mark (wing on dark-blue square) always keeps its brand colours.
 * The wordmark text uses `fill="currentColor"` so it is dark in light mode
 * and white in dark mode automatically, with no extra CSS needed.
 *
 * Size it only with `height` (or `h-*`); width scales automatically from the
 * 230 × 52 viewBox aspect ratio (~4.4 : 1).
 */
export function KampulseLogo({ className }: KampulseLogoProps) {
  return (
    <svg
      viewBox="0 0 230 52"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kampulse Handling Solutions Ltd"
      role="img"
      className={className}
      fill="none"
    >
      {/* ── Icon mark: dark-blue rounded square, brand colours ── */}
      <rect width="52" height="52" rx="10" fill="#1a1a2e" />

      {/* Top wing — bright blue */}
      <path
        d="M19 18 Q26 14 34 17 Q30 20 23 20.6 Z"
        fill="#4FC3F7"
        opacity="0.95"
      />
      {/* Middle wing — medium blue */}
      <path
        d="M18 22 Q25.6 18 33.6 20.6 Q29.6 23.4 22 24.2 Z"
        fill="#2196F3"
        opacity="0.85"
      />
      {/* Bottom wing — purple/indigo */}
      <path
        d="M19.6 26 Q26 22.6 32.4 25 Q28.8 27.4 22.4 28 Z"
        fill="#7C4DFF"
        opacity="0.75"
      />

      {/* ── Wordmark: currentColor adapts to light/dark theme ── */}
      <text
        x="62"
        y="28"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="1.5"
        fill="currentColor"
      >
        KAMPULSE
      </text>
      <text
        x="63"
        y="42"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="7.5"
        fontWeight="500"
        letterSpacing="1.5"
        fill="currentColor"
        opacity="0.65"
      >
        HANDLING SOLUTIONS LTD.
      </text>
    </svg>
  );
}
