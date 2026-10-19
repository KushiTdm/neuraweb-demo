"use client";

import { useState } from "react";
import { Send, Loader2, MailCheck } from "lucide-react";
import { ChatIcon } from "@/components/brand/icons";
import { getAttribution } from "@/components/attribution";
import { Modal } from "./modal";
import { useUIStore } from "@/lib/ui-store";

/** Secteurs affichés → valeur envoyée à l'API (`demo_leads.sector`). */
const SECTORS: { label: string; value: string }[] = [
  { label: "Collectivité", value: "collectivite" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Hôtel", value: "hotel" },
  { label: "Autre", value: "general" },
];

/** Formulaire de lead RÉEL — POST /api/lead (insert Supabase + e-mail Resend). */
export function ContactDialog() {
  const open = useUIStore((s) => s.contactOpen);
  const context = useUIStore((s) => s.contactContext);
  const source = useUIStore((s) => s.contactSource);
  const close = useUIStore((s) => s.closeContact);

  const [sector, setSector] = useState("collectivite");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot anti-bot : rempli uniquement par des robots.
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setSent(false);
    setSending(false);
    setError(null);
    setName("");
    setEmail("");
    setMessage("");
    setCompany("");
  };

  const submit = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Merci de renseigner votre nom, votre e-mail et votre message.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          sector,
          source: source ?? "contact",
          context: [context, getAttribution()].filter(Boolean).join(" · ").slice(0, 300) || undefined,
          company, // honeypot
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "L'envoi a échoué. Réessayez ou écrivez à contact@neuraweb.fr.");
        setSending(false);
        return;
      }
      setSending(false);
      setSent(true);
    } catch {
      setError("Connexion impossible. Réessayez ou écrivez à contact@neuraweb.fr.");
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        close();
        setTimeout(reset, 250);
      }}
      title="Discuter de votre projet"
      subtitle="NeuraWeb — agence française, équipe à Hanoï"
      icon={<ChatIcon className="h-5 w-5" />}
    >
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/15 text-lime">
            <MailCheck className="h-7 w-7" />
          </span>
          <p className="mt-3 font-display text-lg font-semibold text-white">Demande envoyée</p>
          <p className="mt-1 text-sm text-white/55">
            Merci {name || ""} ! Votre demande a bien été transmise à l'équipe NeuraWeb. Un expert
            vous recontacte sous 48 h ouvrées à l'adresse indiquée.
          </p>
          <button
            onClick={() => {
              close();
              setTimeout(reset, 250);
            }}
            className="mt-5 rounded-xl bg-navy-100 px-5 py-2.5 text-sm font-semibold text-navy-950"
          >
            Fermer
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {context && (
            <p className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/55">
              À propos de : <span className="text-sky-300">{context}</span>
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Votre secteur</label>
            <div className="flex flex-wrap gap-1.5">
              {SECTORS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSector(s.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    sector === s.value ? "bg-sky-400/20 text-sky-200 ring-1 ring-sky-400/40" : "bg-white/5 text-white/55 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className="h-10 rounded-xl border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-10 rounded-xl border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none" />
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Décrivez votre besoin…" className="w-full resize-none rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none" />
          {/* Honeypot anti-bot : invisible pour les humains. */}
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            placeholder="Société"
          />
          {error && (
            <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          )}
          <button
            onClick={submit}
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-100 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-black/20 hover:bg-white disabled:opacity-60"
          >
            {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</> : <><Send className="h-4 w-4" /> Envoyer ma demande</>}
          </button>
          <p className="text-center text-[11px] text-white/35">Votre demande est transmise à l'équipe NeuraWeb — réponse sous 48 h ouvrées.</p>
        </div>
      )}
    </Modal>
  );
}
