"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Button ──────────────────────────────────────────────────────────────── */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        solid: "bg-navy-100 text-navy-950 shadow-lg shadow-black/20 hover:bg-white",
        coral: "bg-coral text-white shadow-lg shadow-coral/20 hover:bg-coral/90",
        outline: "border border-white/15 text-white hover:border-sky-400/50 hover:bg-white/5",
        ghost: "text-white/70 hover:bg-white/8 hover:text-white",
        soft: "bg-white/8 text-white hover:bg-white/12",
        light: "bg-navy-900 text-white hover:bg-navy-800",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/* ── Card ────────────────────────────────────────────────────────────────── */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-2xl", className)} {...props} />;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="text-sky-400">{icon}</span>}
        <div className="min-w-0">
          <h3 className="truncate font-display text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="truncate text-xs text-white/50">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ── Search input ────────────────────────────────────────────────────────── */
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-xl border border-white/12 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none"
      />
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, hint }: { icon?: React.ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      {icon && <div className="text-white/25">{icon}</div>}
      <p className="text-sm font-medium text-white/60">{title}</p>
      {hint && <p className="max-w-xs text-xs text-white/35">{hint}</p>}
    </div>
  );
}

/* ── Section heading (light, pour pages marketing) ───────────────────────── */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium text-sky-300", className)}>
      {children}
    </span>
  );
}
