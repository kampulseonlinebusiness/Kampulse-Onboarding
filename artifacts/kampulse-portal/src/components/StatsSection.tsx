import React, { useEffect, useRef, useState } from "react";
import { Users, MapPin, Building2, TrendingUp } from "lucide-react";

/* ─── public types ───────────────────────────────────────────────────────────── */

export interface StatDef {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  Icon: React.FC<{ className?: string }>;
  accent: {
    bar: string;
    iconBg: string;
    iconText: string;
    number: string;
    glow: string;
  };
}

/* ─── default dataset (homepage) ────────────────────────────────────────────── */

export const DEFAULT_STATS: StatDef[] = [
  {
    value: 500,
    suffix: "+",
    label: "Professionals Engaged",
    sublabel: "Across multiple industries",
    Icon: Users,
    accent: {
      bar: "bg-blue-500",
      iconBg: "bg-blue-500/15",
      iconText: "text-blue-400",
      number: "text-blue-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(59,130,246,0.18) 0%, transparent 100%)",
    },
  },
  {
    value: 12,
    suffix: "",
    label: "States Reached",
    sublabel: "Nationwide presence in Nigeria",
    Icon: MapPin,
    accent: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-500/15",
      iconText: "text-emerald-400",
      number: "text-emerald-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(16,185,129,0.18) 0%, transparent 100%)",
    },
  },
  {
    value: 8,
    suffix: "+",
    label: "Industries Served",
    sublabel: "From finance to technology",
    Icon: Building2,
    accent: {
      bar: "bg-violet-500",
      iconBg: "bg-violet-500/15",
      iconText: "text-violet-400",
      number: "text-violet-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(139,92,246,0.18) 0%, transparent 100%)",
    },
  },
  {
    value: 5,
    suffix: "+",
    label: "Years of Excellence",
    sublabel: "Building Nigeria's future workforce",
    Icon: TrendingUp,
    accent: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-500/15",
      iconText: "text-amber-400",
      number: "text-amber-400",
      glow: "radial-gradient(ellipse 120px 60px at 50% 60%, rgba(245,158,11,0.18) 0%, transparent 100%)",
    },
  },
];

/* ─── animated counter ───────────────────────────────────────────────────────── */

function AnimatedCounter({
  target,
  suffix,
  duration = 2200,
  isActive,
  className,
}: {
  target: number;
  suffix: string;
  duration?: number;
  isActive: boolean;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let startTime: number | null = null;

    function step(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    }

    requestAnimationFrame(step);
  }, [isActive, target, duration]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── single card ────────────────────────────────────────────────────────────── */

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: StatDef;
  index: number;
  isVisible: boolean;
}) {
  const delay = index * 150;

  return (
    <div
      className="relative flex flex-col items-center text-center px-8 py-14 group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* coloured top bar */}
      <span
        className={`absolute top-0 left-8 right-8 h-[2px] ${stat.accent.bar} rounded-full`}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.4s ease ${delay + 300}ms`,
        }}
      />

      {/* radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: stat.accent.glow, opacity: 0.9 }}
      />

      {/* icon badge */}
      <div
        className={`relative z-10 mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${stat.accent.iconBg} ${stat.accent.iconText} ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110`}
      >
        <stat.Icon className="h-5 w-5" />
      </div>

      {/* animated number */}
      <div
        className="relative z-10 font-extrabold leading-none tracking-tight mb-3"
        style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}
      >
        <AnimatedCounter
          target={stat.value}
          suffix={stat.suffix}
          isActive={isVisible}
          className={stat.accent.number}
        />
      </div>

      {/* label */}
      <p className="relative z-10 text-white font-semibold text-base mb-1 tracking-tight">
        {stat.label}
      </p>

      {/* sublabel */}
      <p className="relative z-10 text-white/40 text-xs leading-relaxed max-w-[160px]">
        {stat.sublabel}
      </p>
    </div>
  );
}

/* ─── section ────────────────────────────────────────────────────────────────── */

interface StatsSectionProps {
  /** Override the default stats. Must be 2–4 items. */
  stats?: StatDef[];
}

export function StatsSection({ stats = DEFAULT_STATS }: StatsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-0"
      aria-label="Company impact metrics"
    >
      <div className="bg-[#0d1117] border-y border-white/[0.06]">
        {/* ambient mesh */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(30,58,138,0.25) 0%, transparent 70%), " +
              "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(109,40,217,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`grid grid-cols-1 divide-y divide-white/[0.07] ${
              stats.length === 2
                ? "sm:grid-cols-2 sm:divide-y-0 sm:divide-x"
                : stats.length === 3
                ? "sm:grid-cols-3 sm:divide-y-0 sm:divide-x"
                : "sm:grid-cols-2 lg:grid-cols-4 sm:divide-y-0 sm:divide-x"
            }`}
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
