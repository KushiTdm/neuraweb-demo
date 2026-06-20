"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { verticalFromPath, VERTICALS } from "@/lib/verticals";
import { answerFor, getScript } from "@/lib/assistant";
import { aiLatency, cn, sleep } from "@/lib/utils";

interface Msg {
  id: number;
  role: "user" | "bot";
  text: string;
}

function renderRich(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-navy-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function AssistantWidget() {
  const pathname = usePathname();
  const vertical = verticalFromPath(pathname);
  const script = getScript(vertical);
  const accent = vertical ? VERTICALS[vertical].styles : null;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [{ id: 0, role: "bot", text: script.greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [convVertical, setConvVertical] = useState(vertical);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = () => ++idRef.current;

  // réinitialise la conversation au changement de secteur (pattern « previous prop », sans effet)
  if (convVertical !== vertical) {
    setConvVertical(vertical);
    setMessages([{ id: 0, role: "bot", text: script.greeting }]);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const ask = async (text: string) => {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setInput("");
    setTyping(true);
    await sleep(aiLatency()); // latence simulée
    const reply = answerFor(vertical, text);
    setTyping(false);
    setMessages((m) => [...m, { id: nextId(), role: "bot", text: reply }]);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant IA"}
        className={cn(
          "no-print fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition active:scale-95",
          "bg-gradient-to-br from-sky-400 to-cyan-500 shadow-cyan-500/30",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="no-print fixed bottom-20 right-4 z-50 flex h-[30rem] max-h-[72vh] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/12 bg-navy-900 shadow-2xl"
            role="dialog"
            aria-label="Assistant IA de démonstration"
          >
            {/* header */}
            <div className="flex items-center gap-2.5 border-b border-white/10 bg-gradient-to-r from-navy-900 to-navy-800 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-navy-950">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Assistant IA — démo</p>
                <p className="truncate text-xs text-white/45">{vertical ? VERTICALS[vertical].name : "NeuraWeb Connected Suite"}</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-sky-300">
                <Sparkles className="h-3 w-3" /> simulé
              </span>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface px-3 py-3">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? cn("rounded-br-sm text-white", accent?.solid ?? "bg-sky-500")
                        : "rounded-bl-sm border border-navy-900/10 bg-white text-navy-800 shadow-sm",
                    )}
                  >
                    {m.role === "bot" ? renderRich(m.text) : m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-navy-900/10 bg-white px-3 py-2.5 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-navy-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        style={{ background: "#94a3b8" }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-white/8 bg-surface px-3 py-2">
                {script.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-navy-900/15 bg-white px-2.5 py-1 text-xs text-navy-700 transition hover:border-sky-400 hover:text-navy-900"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-navy-900 p-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message…"
                aria-label="Message à l'assistant"
                className="h-9 flex-1 rounded-xl border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Envoyer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 text-navy-950 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
