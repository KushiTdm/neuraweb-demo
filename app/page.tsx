"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Zap,
  Bot,
  ShieldCheck,
  Download,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { Thumb } from "@/components/asset-image";
import { Eyebrow } from "@/components/ui/primitives";
import { VERTICAL_LIST } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";
import { openContact } from "@/lib/ui-store";
import { NEURAWEB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const CARD_IMG: Record<VerticalId, string> = {
  collectivite: "hero",
  restaurant: "hero-resto",
  hotel: "hero-hotel",
};

const CAPABILITIES = [
  { icon: Monitor, label: "Web + Mobile", hint: "Back-office + app mobile ou site web client" },
  { icon: Zap, label: "Temps réel", hint: "État partagé, synchro instantanée" },
  { icon: Bot, label: "IA intégrée", hint: "Assistant & suggestions contextuelles" },
  { icon: ShieldCheck, label: "RGPD / Accessibilité", hint: "RGAA, transparence IA" },
  { icon: Download, label: "PWA", hint: "Installable, mobile-first" },
];

const STEPS = [
  { n: "01", title: "Choisissez un métier", text: "Collectivité, restaurant ou hôtel — chacun a son écosystème dédié." },
  { n: "02", title: "Agissez côté client", text: "Signalez, commandez, réservez depuis l'app citoyenne ou le site web." },
  { n: "03", title: "Observez le back-office", text: "L'action remonte instantanément. L'établissement valide → le client est notifié." },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Launcher() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* halos décoratifs */}
      <div className="halo left-[-10%] top-[-5%] h-96 w-96 bg-sky-500" />
      <div className="halo right-[-8%] top-[20%] h-80 w-80 bg-cyan-500" />
      <div className="halo bottom-[5%] left-[30%] h-72 w-72 bg-indigo-500/60" />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={NEURAWEB_URL}
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/70 transition hover:text-white sm:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            neuraweb.fr
          </a>
          <button
            onClick={() => openContact()}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Discuter de votre projet
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-10 text-center sm:pt-16">
        <motion.div initial="hidden" animate="show" variants={fade} custom={0}>
          <Eyebrow>
            <Sparkles className="h-3.5 w-3.5" /> Démo interactive — web + mobile connectés
          </Eyebrow>
        </motion.div>
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fade}
          custom={1}
          className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
        >
          Une démo, trois métiers,
          <br />
          <span className="text-gradient">un même savoir-faire connecté.</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          variants={fade}
          custom={2}
          className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg"
        >
          NeuraWeb conçoit des écosystèmes sur-mesure où le back-office et l'expérience client —
          application mobile ou site web — parlent en temps réel. Choisissez un secteur et voyez la connexion en direct.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="show"
          variants={fade}
          custom={3}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#secteurs"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-lg shadow-white/15 transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Explorer la démo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => openContact()}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Parler à un expert
          </button>
        </motion.div>
      </section>

      {/* secteurs */}
      <section id="secteurs" className="relative z-10 mx-auto max-w-6xl scroll-mt-20 px-5 pb-8">
        <div className="grid gap-5 md:grid-cols-3">
          {VERTICAL_LIST.map((v, i) => (
            <motion.div
              key={v.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fade}
              custom={i}
            >
              <Link
                href={`/${v.slug}`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b p-6 transition-all hover:-translate-y-1 hover:border-white/20",
                  v.styles.gradient,
                )}
              >
                <Thumb name={CARD_IMG[v.id]} alt="" className="absolute inset-0 opacity-20 transition group-hover:opacity-30" sizes="(max-width: 768px) 100vw, 380px" imgClassName="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 to-navy-950/80" />
                <div className={cn("halo right-[-20%] top-[-20%] h-40 w-40 opacity-30 transition group-hover:opacity-50", v.styles.halo)} />
                <div className="relative flex items-center justify-between">
                  <span className="text-4xl">{v.emoji}</span>
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", v.styles.softBg, v.styles.text, v.styles.border)}>
                    {v.sector}
                  </span>
                </div>
                <h3 className="relative mt-4 font-display text-xl font-semibold text-white">{v.name}</h3>
                <p className="relative mt-1 text-sm text-white/60">{v.tagline}</p>
                <ul className="relative mt-4 flex flex-wrap gap-1.5">
                  {v.features.map((f) => (
                    <li key={f} className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/70">
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                  Ouvrir le Split View
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* capacités */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-12">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {CAPABILITIES.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 text-sky-300">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-white">{c.label}</span>
                <span className="text-xs text-white/45">{c.hint}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* comment ça marche */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-14">
        <div className="mb-7 text-center">
          <Eyebrow>
            <Zap className="h-3.5 w-3.5" /> La démonstration « connectée »
          </Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Web ↔ mobile, en temps réel</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-5">
              <span className="font-display text-3xl font-bold text-gradient">{s.n}</span>
              <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-white/55">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-white/45">
          <Smartphone className="h-4 w-4 shrink-0 text-cyan-400" />
          Astuce : sur chaque secteur, lancez le « Mode présentation » pour une démo mains-libres.
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/8 px-5 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="flex items-center gap-2 text-xs text-white/40">
            <RefreshCw className="h-3.5 w-3.5" />
            Maquette à but d'illustration — fonctionnalités simulées, données fictives.
          </p>
          <a
            href={NEURAWEB_URL}
            className="text-xs text-white/40 transition hover:text-white"
          >
            © NeuraWeb — Lille, partout en France. · neuraweb.fr
          </a>
        </div>
      </footer>
    </div>
  );
}
