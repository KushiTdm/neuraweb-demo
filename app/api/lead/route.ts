// ============================================================
// app/api/lead/route.ts
// Réception des sollicitations de la démo (formulaire « Discuter de votre
// projet » + escalade depuis l'assistant). En parallèle :
//   (a) insert dans Supabase `demo_leads` via service-role (→ Realtime →
//       notification dans le cockpit mobile) ;
//   (b) e-mail de notification via Resend (contact@neuraweb.fr).
// Best-effort : renvoie succès tant que l'un des deux legs aboutit.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";
import { sendDemoLeadEmail } from "@/lib/email-service";

// Exécution Node (le SDK Supabase service-role et Resend ne tournent pas sur Edge).
export const runtime = "nodejs";

const VALID_SECTORS = new Set(["collectivite", "restaurant", "hotel", "general"]);
const VALID_SOURCES = new Set(["contact", "assistant"]);

// Rate limit léger par IP (perdu au cold start — acceptable pour une démo).
const RATE_LIMIT = { max: 5, windowMs: 60_000 };
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de demandes. Réessayez dans une minute." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    // Honeypot : champ leurre rempli = bot → on acquitte sans rien traiter.
    if (typeof body.company === "string" && body.company.trim().length > 0) {
      return NextResponse.json({ success: true, emailSent: false });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Merci de renseigner votre nom, votre e-mail et votre message." },
        { status: 400 },
      );
    }
    if (name.length > 120 || email.length > 200 || message.length > 4000) {
      return NextResponse.json({ error: "Champs trop longs." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }

    const sectorRaw = typeof body.sector === "string" ? body.sector.trim().toLowerCase() : "";
    const sector = VALID_SECTORS.has(sectorRaw) ? sectorRaw : "general";
    const source =
      typeof body.source === "string" && VALID_SOURCES.has(body.source) ? body.source : "contact";
    const context =
      typeof body.context === "string" ? body.context.trim().slice(0, 300) || null : null;

    // (a) Insert Supabase (best-effort) + (b) e-mail (best-effort), en parallèle.
    const supabase = getServiceSupabase();
    const insertPromise = supabase
      ? supabase
          .from("demo_leads")
          .insert({ name, email, message, sector, source, context, ip })
          .then(({ error }) => {
            if (error) console.warn("[demo_leads] insert warning:", error.message);
            return !error;
          })
      : Promise.resolve(false);

    const emailPromise = sendDemoLeadEmail({
      name,
      email,
      message,
      sector,
      source,
      context: context ?? undefined,
    });

    const [inserted, emailResult] = await Promise.all([insertPromise, emailPromise]);

    if (!inserted && !emailResult.success) {
      // Les deux legs ont échoué → on ne peut pas garantir la réception.
      return NextResponse.json(
        { error: "L'envoi a échoué. Écrivez-nous à contact@neuraweb.fr." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, emailSent: emailResult.success });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Demo lead error:", msg);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
