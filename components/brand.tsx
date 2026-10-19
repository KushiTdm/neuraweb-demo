import Link from "next/link";
import { NeuraWebLogo } from "@/components/brand/neuraweb-logo";
import { cn } from "@/lib/utils";

export function Logo({ className, withTag = true }: { className?: string; withTag?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      {/* Logo NeuraWeb 2026 (SVG, couleur = Pale Gray sur fond Rich Blue) */}
      <NeuraWebLogo
        height={26}
        title="NeuraWeb"
        className="w-auto text-sky-200 transition-opacity duration-200 group-hover:opacity-80"
      />
      {withTag && (
        <span className="hidden border-l border-white/15 pl-2.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-sky-300 sm:inline-block">
          Connected
          <br />
          Suite
        </span>
      )}
    </Link>
  );
}
