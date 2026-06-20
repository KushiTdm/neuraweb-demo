"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

/* ── Compteur animé ──────────────────────────────────────────────────────── */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 900,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const mounted = useMounted();
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!mounted) return;
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, mounted]);

  const shown = mounted ? display : value;
  return (
    <span suppressHydrationWarning>
      {prefix}
      {shown.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ── Sparkline SVG ───────────────────────────────────────────────────────── */
export function Sparkline({
  data,
  className,
  stroke = "currentColor",
}: {
  data: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 100;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / span) * h;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const gid = `spark-${stroke.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-8 w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ── Carte KPI ───────────────────────────────────────────────────────────── */
export function KpiCard({
  label,
  value,
  decimals,
  prefix,
  suffix,
  delta,
  icon: Icon,
  spark,
  accentClass = "text-sky-400",
}: {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delta?: number;
  icon?: LucideIcon;
  spark?: number[];
  accentClass?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-white/55">{label}</p>
        {Icon && <Icon className={cn("h-4 w-4", accentClass)} />}
      </div>
      <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-white">
        <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        {delta !== undefined && (
          <span className={cn("flex items-center gap-1 text-xs font-medium", up ? "text-lime" : "text-coral")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}
            {delta}%
          </span>
        )}
        {spark && (
          <div className={cn("ml-auto w-20", accentClass)}>
            <Sparkline data={spark} />
          </div>
        )}
      </div>
    </div>
  );
}
