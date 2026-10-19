"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { FlaskConical, ArrowLeft, Home, Send } from "lucide-react";
import { Logo } from "./brand";
import { openContact } from "@/lib/ui-store";

export function DemoStub() {
  const router = useRouter();
  const params = useSearchParams();
  const feature = params.get("feature") ?? "Cette fonctionnalité";
  const from = params.get("from");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="halo left-[10%] top-[0%] h-80 w-80 bg-sky-500" />
      <div className="halo right-[5%] bottom-[10%] h-72 w-72 bg-cyan-500" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass w-full rounded-3xl p-8"
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 text-sky-300">
            <FlaskConical className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">Ceci est une démonstration</h1>
          <p className="mt-3 text-white/60">
            La fonctionnalité <span className="font-semibold text-sky-300">« {feature} »</span> serait
            pleinement développée dans la version finale de votre outil sur-mesure.
          </p>
          {from && (
            <p className="mt-2 text-xs text-white/35">
              Demandée depuis <code className="rounded bg-white/8 px-1.5 py-0.5">{from}</code>
            </p>
          )}

          <button
            onClick={() => openContact(feature)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-100 px-5 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-black/20 transition hover:bg-white"
          >
            <Send className="h-4 w-4" />
            Demander cette fonctionnalité
          </button>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => router.back()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" /> Revenir
            </button>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              <Home className="h-4 w-4" /> Accueil de la démo
            </Link>
          </div>
        </motion.div>

        <p className="mt-6 text-xs text-white/35">
          Aucune fonctionnalité n'est un cul-de-sac : chaque lien de la démo aboutit à une vraie vue ou à cette page.
        </p>
      </main>
    </div>
  );
}
