"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Smartphone, Monitor, Zap, Bot, ShieldCheck, Download, Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand";
import { VerticalIcon } from "@/components/brand/icons";
import { ContactButton } from "@/components/contact-button";
import { Eyebrow } from "@/components/ui/primitives";
import { VERTICAL_LIST } from "@/lib/verticals";
import { HOME_FAQ } from "@/lib/faq";
import type { VerticalId } from "@/lib/types";
import { NEURAWEB_URL, NEURAWEB_LINKS } from "@/lib/site";

const CARD_ART: Record<VerticalId, string> = {
  collectivite: "/assets/demo-collectivite.webp",
  restaurant: "/assets/demo-restaurant.webp",
  hotel: "/assets/demo-hotel.webp",
};

/** Phrase de cas d'usage (texte indexable) affichée sous chaque carte. */
const USE_CASE: Record<VerticalId, string> = {
  collectivite: "Un habitant signale un dépôt sauvage depuis son téléphone ; la mairie le voit, le traite et lui répond en temps réel.",
  restaurant: "Un client commande ou réserve sur le site ; l'écran cuisine se met à jour aussitôt, et le client suit sa commande.",
  hotel: "Un voyageur réserve et fait son check-in en ligne ; la réception voit l'arrivée et gère la conciergerie depuis sa console.",
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

export function Launcher() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
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
          <ContactButton />
        </div>
      </header>

      <main>
        {/* hero */}
        <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="text-center lg:text-left">
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
              className="mt-5 font-impact text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl"
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
              className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg lg:mx-0"
            >
              NeuraWeb conçoit des écosystèmes sur-mesure où le back-office et l'expérience client — application mobile ou
              site web — parlent en temps réel. Choisissez un secteur et voyez la connexion en direct.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fade}
              custom={3}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Link
                href="#secteurs"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-100 px-7 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explorer la démo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={NEURAWEB_LINKS.booking}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-100/30 px-7 py-3 text-sm font-semibold text-navy-100 transition hover:border-navy-100/60 hover:bg-white/10"
              >
                Demander un devis
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl bg-navy-100 shadow-2xl shadow-black/30 ring-1 ring-white/10 lg:max-w-none"
          >
            <Image
              src="/assets/demo-hero.webp"
              alt="Un ordinateur portable et un smartphone reliés : le back-office et l'application se synchronisent en temps réel"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover object-right"
            />
          </motion.div>
        </section>

        {/* secteurs */}
        <section id="secteurs" aria-labelledby="secteurs-titre" className="relative z-10 mx-auto max-w-6xl scroll-mt-20 px-5 pb-8">
          <h2 id="secteurs-titre" className="mb-6 text-center font-display text-2xl font-bold text-white sm:text-3xl">
            Trois secteurs à explorer
          </h2>
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
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-900/80 transition-all hover:-translate-y-1 hover:border-navy-100/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
                    <Image
                      src={CARD_ART[v.id]}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-100/10 text-sky-300 ring-1 ring-inset ring-navy-100/15">
                        <VerticalIcon id={v.id} className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-navy-100/10 px-2.5 py-1 text-[11px] font-semibold text-sky-300 ring-1 ring-inset ring-navy-100/15">
                        {v.sector}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-white">{v.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{v.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{USE_CASE[v.id]}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {v.features.map((f) => (
                        <li key={f} className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/70">
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-white">
                      Ouvrir la démo
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
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
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-100/10 text-sky-300 ring-1 ring-inset ring-navy-100/15">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-white">{c.label}</span>
                  <span className="text-xs text-white/60">{c.hint}</span>
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
                <span className="font-impact text-3xl font-black text-gradient">{s.n}</span>
                <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-white/65">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-white/60">
            <Smartphone className="h-4 w-4 shrink-0 text-sky-300" />
            Astuce : sur chaque secteur, lancez le « Mode présentation » pour une démo mains-libres.
          </div>
        </section>

        {/* FAQ (texte indexable + balisage FAQPage dans app/page.tsx) */}
        <section aria-labelledby="faq-titre" className="relative z-10 mx-auto max-w-3xl px-5 pb-14">
          <h2 id="faq-titre" className="mb-6 text-center font-display text-2xl font-bold text-white sm:text-3xl">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {HOME_FAQ.map((f) => (
              <details key={f.q} className="glass group rounded-2xl px-5 py-4 open:border-navy-100/25">
                <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 font-display text-base font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-sky-300 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* appel à l'action final */}
        <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16">
          <div className="rounded-3xl bg-navy-100 px-6 py-10 text-center sm:px-12">
            <h2 className="font-impact text-3xl font-black text-navy-950 sm:text-4xl">Un projet comparable ?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-navy-700 sm:text-base">
              Décrivez votre besoin : devis gratuit, réponse sous 48 h ouvrées, contrat et facture français.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ContactButton
                variant="solid"
                label="Discuter de votre projet"
                className="!bg-navy-800 !text-navy-100 hover:!bg-navy-700"
              />
              <a
                href={NEURAWEB_LINKS.services}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-800/30 px-6 py-2.5 text-sm font-semibold text-navy-800 transition hover:bg-navy-800/10"
              >
                Voir les tarifs
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/8 px-5 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="flex items-center gap-2 text-xs text-white/60">
            <RefreshCw className="h-3.5 w-3.5" />
            Maquette à but d'illustration — fonctionnalités simulées, données fictives.
          </p>
          <nav aria-label="NeuraWeb" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/70 sm:justify-end">
            <a href={NEURAWEB_LINKS.web} className="transition hover:text-white">Développement web</a>
            <a href={NEURAWEB_LINKS.mobile} className="transition hover:text-white">Applications mobiles</a>
            <a href={NEURAWEB_LINKS.automation} className="transition hover:text-white">Automatisation</a>
            <a href={NEURAWEB_LINKS.ai} className="transition hover:text-white">Intégration IA</a>
            <a href={NEURAWEB_LINKS.sectors} className="transition hover:text-white">Secteurs</a>
            <a href={NEURAWEB_LINKS.contact} className="transition hover:text-white">Contact</a>
          </nav>
        </div>
        <p className="mx-auto mt-3 max-w-6xl text-center text-xs text-white/60 sm:text-left">
          <a href={NEURAWEB_URL} className="transition hover:text-white">
            © NeuraWeb — agence web & IA française immatriculée à Lille, équipe à Hanoï · neuraweb.fr
          </a>
        </p>
      </footer>
    </div>
  );
}
