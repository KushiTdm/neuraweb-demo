"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import type { Audience, AppNotification, VerticalId } from "@/lib/types";
import { RelativeTime } from "./relative-time";
import { cn } from "@/lib/utils";

function toneIcon(tone?: AppNotification["tone"]) {
  if (tone === "success") return <CheckCircle2 className="h-4 w-4 text-lime" />;
  if (tone === "warn") return <AlertTriangle className="h-4 w-4 text-coral" />;
  return <Info className="h-4 w-4 text-sky-400" />;
}

/* ── Cloche + panneau ────────────────────────────────────────────────────── */
export function NotificationBell({
  vertical,
  audience,
  theme = "dark",
}: {
  vertical: VerticalId;
  audience: Audience;
  theme?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  const notifications = useDemoStore((s) => s.notifications);
  const markAllRead = useDemoStore((s) => s.markAllRead);
  const list = notifications.filter((n) => n.vertical === vertical && n.audience === audience);
  const unread = list.filter((n) => !n.read).length;
  const light = theme === "light";

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unread) setTimeout(() => markAllRead(vertical, audience), 800);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        aria-label={`Notifications (${unread} non lue${unread > 1 ? "s" : ""})`}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border transition",
          light ? "border-navy-900/10 bg-white text-navy-700 hover:bg-navy-50" : "border-white/12 bg-white/5 text-white/70 hover:text-white",
        )}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-80 max-w-[86vw] overflow-hidden rounded-2xl border shadow-2xl",
            light ? "border-navy-900/10 bg-white" : "border-white/12 bg-navy-900",
          )}
        >
          <div className={cn("flex items-center justify-between border-b px-3 py-2.5", light ? "border-navy-900/10" : "border-white/10")}>
            <span className={cn("text-sm font-semibold", light ? "text-navy-900" : "text-white")}>Notifications</span>
            {unread > 0 && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  markAllRead(vertical, audience);
                }}
                className="inline-flex items-center gap-1 text-xs text-sky-500 hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Tout lire
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {list.length === 0 ? (
              <p className={cn("px-3 py-8 text-center text-sm", light ? "text-navy-400" : "text-white/40")}>Aucune notification</p>
            ) : (
              list.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-2.5 border-b px-3 py-2.5 last:border-0",
                    light ? "border-navy-900/5" : "border-white/5",
                    !n.read && (light ? "bg-sky-50" : "bg-white/5"),
                  )}
                >
                  <span className="mt-0.5">{toneIcon(n.tone)}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", light ? "text-navy-900" : "text-white")}>{n.title}</p>
                    <p className={cn("text-xs", light ? "text-navy-500" : "text-white/55")}>{n.body}</p>
                    <RelativeTime iso={n.ts} className={cn("text-[11px]", light ? "text-navy-400" : "text-white/35")} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Toast « live » : pop quand une nouvelle notif arrive ────────────────── */
export function LiveToast({ vertical, audience, theme = "dark" }: { vertical: VerticalId; audience: Audience; theme?: "dark" | "light" }) {
  const notifications = useDemoStore((s) => s.notifications);
  const latest = notifications.find((n) => n.vertical === vertical && n.audience === audience);
  const [toast, setToast] = useState<AppNotification | null>(null);
  const seenRef = useRef<string | null>(null);
  const initRef = useRef(false);
  const light = theme === "light";

  useEffect(() => {
    // au montage, on mémorise la dernière notif sans l'afficher
    if (!initRef.current) {
      initRef.current = true;
      seenRef.current = latest?.id ?? null;
      return;
    }
    if (latest && latest.id !== seenRef.current) {
      seenRef.current = latest.id;
      setToast(latest);
      const t = setTimeout(() => setToast(null), 4200);
      return () => clearTimeout(t);
    }
  }, [latest]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          className={cn(
            "absolute left-1/2 top-2 z-40 flex w-[92%] -translate-x-1/2 items-start gap-2.5 rounded-2xl border px-3 py-2.5 shadow-xl",
            light ? "border-navy-900/10 bg-white/95 backdrop-blur" : "border-white/12 bg-navy-800/95 backdrop-blur",
          )}
        >
          <span className="mt-0.5">{toneIcon(toast.tone)}</span>
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-semibold leading-tight", light ? "text-navy-900" : "text-white")}>{toast.title}</p>
            <p className={cn("text-xs leading-snug", light ? "text-navy-500" : "text-white/55")}>{toast.body}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
