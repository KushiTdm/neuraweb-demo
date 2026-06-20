import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  label: string;
  hint?: string;
  state: "done" | "current" | "todo";
}

export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("relative space-y-4", className)}>
      {steps.map((s, i) => (
        <li key={i} className="relative flex gap-3 pl-1">
          {i < steps.length - 1 && (
            <span
              className={cn(
                "absolute left-[11px] top-6 h-[calc(100%+0.3rem)] w-px",
                s.state === "done" ? "bg-lime/50" : "bg-white/12",
              )}
            />
          )}
          <span
            className={cn(
              "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2",
              s.state === "done" && "bg-lime/20 text-lime ring-lime/40",
              s.state === "current" && "animate-pulse-ring bg-coral/20 text-coral-soft ring-coral/50",
              s.state === "todo" && "bg-white/5 text-white/30 ring-white/15",
            )}
          >
            {s.state === "done" ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-current" />}
          </span>
          <div className="pb-0.5">
            <p className={cn("text-sm font-medium", s.state === "todo" ? "text-white/40" : "text-white")}>{s.label}</p>
            {s.hint && <p className="text-xs text-white/45">{s.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
