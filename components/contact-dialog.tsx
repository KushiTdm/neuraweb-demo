"use client";

import { useState } from "react";
import { Send, Loader2, MailCheck, Sparkles } from "lucide-react";
import { Modal } from "./modal";
import { useUIStore } from "@/lib/ui-store";
import { sleep } from "@/lib/utils";

const SECTORS = ["Collectivité", "Restaurant", "Hôtel", "Autre"];

/** Prise de contact mockée (fonctionnelle) — remplace les CTA « Discuter de votre projet ». */
export function ContactDialog() {
  const open = useUIStore((s) => s.contactOpen);
  const context = useUIStore((s) => s.contactContext);
  const close = useUIStore((s) => s.closeContact);

  const [sector, setSector] = useState("Collectivité");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = () => {
    setSent(false);
    setSending(false);
    setName("");
    setEmail("");
    setMessage("");
  };

  const submit = async () => {
    setSending(true);
    await sleep(1100);
    setSending(false);
    setSent(true);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        close();
        setTimeout(reset, 250);
      }}
      title="Discuter de votre projet"
      subtitle="NeuraWeb — Lille, partout en France"
      icon={<Sparkles className="h-5 w-5" />}
    >
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/15 text-lime">
            <MailCheck className="h-7 w-7" />
          </span>
          <p className="mt-3 font-display text-lg font-semibold text-white">Message envoyé 🎉</p>
          <p className="mt-1 text-sm text-white/55">
            Merci {name || ""} ! Un expert NeuraWeb vous recontacterait sous 24 h (démonstration — aucun
            message réel n'est transmis).
          </p>
          <button
            onClick={() => {
              close();
              setTimeout(reset, 250);
            }}
            className="mt-5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-navy-950"
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
                  key={s}
                  onClick={() => setSector(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    sector === s ? "bg-sky-400/20 text-sky-200 ring-1 ring-sky-400/40" : "bg-white/5 text-white/55 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className="h-10 rounded-xl border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-10 rounded-xl border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none" />
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Décrivez votre besoin…" className="w-full resize-none rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none" />
          <button
            onClick={submit}
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-sky-500/20 disabled:opacity-60"
          >
            {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</> : <><Send className="h-4 w-4" /> Envoyer ma demande</>}
          </button>
          <p className="text-center text-[11px] text-white/35">Formulaire de démonstration — données non transmises.</p>
        </div>
      )}
    </Modal>
  );
}
