"use client";

import { Lock, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cadre « fenêtre de navigateur » encapsulant le site web client (mode clair).
 * Signale visuellement qu'il s'agit d'un site web (accès QR/lien), pas d'une app à installer.
 */
export function BrowserFrame({
  children,
  url = "exemple.fr",
  className,
  fullBleed = false,
}: {
  children: React.ReactNode;
  url?: string;
  className?: string;
  fullBleed?: boolean;
}) {
  if (fullBleed) {
    return (
      <div className={cn("relative flex h-full w-full flex-col overflow-hidden bg-surface text-navy-900", className)}>
        <BrowserBar url={url} />
        <div className="relative flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/50",
        className,
      )}
    >
      <BrowserBar url={url} />
      <div className="relative flex h-[660px] max-h-[74vh] flex-col overflow-y-auto overscroll-contain bg-surface text-navy-900">
        {children}
      </div>
    </div>
  );
}

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/20 bg-navy-800 px-3 py-2">
      <div className="flex gap-1.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="ml-1 flex flex-1 items-center gap-1.5 rounded-lg bg-navy-950/70 px-2.5 py-1 text-xs text-white/70">
        <Lock className="h-3 w-3 text-lime" />
        <span className="truncate">{url}</span>
      </div>
      <RotateCw className="h-3.5 w-3.5 text-white/40" />
    </div>
  );
}
