import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, withTag = true }: { className?: string; withTag?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      {/* Logo officiel NeuraWeb (version blanche pour fond sombre) */}
      <Image
        src="/assets/neurawebW.webp"
        alt="NeuraWeb"
        width={160}
        height={48}
        priority
        className="h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
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
