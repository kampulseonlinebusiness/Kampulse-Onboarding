import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

const ORDER: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System mode",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const current = ORDER.includes(theme as any) ? theme : "system";
  const next = ORDER[(ORDER.indexOf(current as any) + 1) % ORDER.length];
  const Icon = ICONS[current as keyof typeof ICONS];

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${LABELS[next]}`}
      title={`Current: ${LABELS[current as keyof typeof LABELS]}. Click for ${LABELS[next]}.`}
      className={className}
      onClick={() => setTheme(next)}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
