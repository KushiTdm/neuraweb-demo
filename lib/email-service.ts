// ============================================================
// lib/email-service.ts
// Envoi de l'e-mail de notification pour une sollicitation de la démo
// (formulaire « Discuter de votre projet »). Version condensée du template
// de marque de project/lib/email-service.ts. Best-effort : ne bloque jamais
// la réponse au visiteur.
// ============================================================

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Initialiser Resend seulement si la clé API est configurée.
const resend =
  RESEND_API_KEY && RESEND_API_KEY !== "re_xxx_your_api_key_here"
    ? new Resend(RESEND_API_KEY)
    : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "contact@neuraweb.fr";
const TO_EMAIL = process.env.TO_EMAIL || "contact@neuraweb.fr";

// Palette de marque NeuraWeb (identique au site principal).
const COLORS = {
  primary: "#b9b6e3",
  secondary: "#2c2679",
  dark: "#0e0a38",
  darkCard: "#140e4f",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  white: "#ffffff",
  border: "rgba(255, 255, 255, 0.06)",
};
const GRADIENT_BRAND = `linear-gradient(135deg, #191265 0%, ${COLORS.secondary} 100%)`;

export interface DemoLeadEmailData {
  name: string;
  email: string;
  message: string;
  /** collectivite | restaurant | hotel | general (ou libellé libre) */
  sector?: string;
  /** contact | assistant */
  source?: string;
  /** contexte facultatif (fonctionnalité / secteur d'où vient la demande) */
  context?: string;
}

/** Échappe le HTML — le contenu vient d'un visiteur potentiellement hostile. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SOURCE_LABELS: Record<string, string> = {
  contact: "Formulaire « Discuter de votre projet »",
  assistant: "Assistant de la démo",
};

function field(label: string, valueHtml: string): string {
  return `
    <div style="background-color:rgba(255,255,255,0.03);border-radius:10px;padding:14px 18px;margin-bottom:10px;border-left:3px solid ${COLORS.primary};">
      <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${COLORS.primary};margin:0 0 6px 0;">${label}</p>
      <p style="font-size:15px;font-weight:500;color:${COLORS.text};margin:0;">${valueHtml}</p>
    </div>`;
}

/**
 * Envoie la notification interne d'une nouvelle sollicitation démo.
 * Renvoie `{ success, error? }` — ne lève jamais.
 */
export async function sendDemoLeadEmail(data: DemoLeadEmailData) {
  if (!resend) {
    console.warn("Resend API key not configured, skipping demo lead email");
    return { success: false, error: "Resend API key not configured" };
  }

  const { name, email, message, sector, source, context } = data;
  const safeName = escapeHtml(name);
  const subject = `🧪 Nouvelle sollicitation démo — ${safeName}`;
  const sourceLabel = (source && SOURCE_LABELS[source]) || source || "Démo";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.dark};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="width:100%;padding:40px 20px;background-color:${COLORS.dark};">
    <div style="max-width:600px;margin:0 auto;background-color:${COLORS.darkCard};border-radius:16px;overflow:hidden;border:1px solid ${COLORS.border};">
      <div style="background:${GRADIENT_BRAND};padding:40px 30px;text-align:center;">
        <h1 style="font-size:30px;font-weight:800;color:${COLORS.white};margin:0;letter-spacing:-0.02em;">NeuraWeb</h1>
        <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:6px 0 0 0;letter-spacing:0.05em;">DÉMO · demo.neuraweb.fr</p>
        <h2 style="font-size:22px;font-weight:700;color:${COLORS.white};margin:20px 0 0 0;">Nouvelle sollicitation</h2>
      </div>
      <div style="padding:34px 30px;background-color:${COLORS.darkCard};">
        <p style="font-size:14px;color:${COLORS.textMuted};margin:0 0 20px 0;">
          Un visiteur de la démo a envoyé une demande via <strong style="color:${COLORS.text};">${escapeHtml(sourceLabel)}</strong>.
        </p>
        ${field("Nom", safeName)}
        ${field("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${COLORS.primary};text-decoration:none;">${escapeHtml(email)}</a>`)}
        ${sector ? field("Secteur", escapeHtml(sector)) : ""}
        ${context ? field("Contexte", escapeHtml(context)) : ""}
        <div style="background-color:rgba(255,255,255,0.03);border-radius:10px;padding:18px;margin:16px 0;border:1px solid ${COLORS.border};">
          <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${COLORS.primary};margin:0 0 10px 0;">Message</p>
          <p style="font-size:15px;color:${COLORS.text};margin:0;white-space:pre-wrap;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="mailto:${escapeHtml(email)}?subject=Re: Votre projet — NeuraWeb" style="display:inline-block;background:${GRADIENT_BRAND};color:${COLORS.white};font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">📧 Répondre au client</a>
        </div>
      </div>
      <div style="background-color:${COLORS.dark};padding:24px 30px;text-align:center;border-top:1px solid ${COLORS.border};">
        <p style="font-size:12px;color:#4b5563;margin:0;">Sollicitation issue de la démo NeuraWeb — également disponible dans le cockpit mobile.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      html: htmlContent,
      replyTo: email,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error sending demo lead email via Resend:", msg);
    return { success: false, error: msg };
  }
}
