import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, withTag = true }: { className?: string; withTag?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
      <span className="leading-none">
        <span className="block font-display text-sm font-bold tracking-tight text-white">NEURAWEB</span>
        {withTag && <span className="block text-[10px] font-medium tracking-wide text-sky-300">CONNECTED SUITE</span>}
      </span>
    </Link>
  );
}
