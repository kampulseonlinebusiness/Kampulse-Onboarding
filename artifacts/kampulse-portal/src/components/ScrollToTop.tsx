import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Scrolls the window to the top on every client-side route change.
 * Place this as a direct child of <WouterRouter> so it fires on every navigation.
 */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
