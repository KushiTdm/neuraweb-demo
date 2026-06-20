"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/utils";

/** Affiche un temps relatif (« il y a 3 min ») qui se rafraîchit, sans mismatch SSR. */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const update = () => setLabel(relativeTime(iso));
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, [iso]);

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label || "à l'instant"}
    </time>
  );
}
