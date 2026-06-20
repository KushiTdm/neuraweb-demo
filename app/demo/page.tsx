import { Suspense } from "react";
import type { Metadata } from "next";
import { DemoStub } from "@/components/demo-stub";

export const metadata: Metadata = {
  title: "Fonctionnalité de démonstration",
};

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-sky-400" />
        </div>
      }
    >
      <DemoStub />
    </Suspense>
  );
}
