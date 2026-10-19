import type { MetadataRoute } from "next";
import { DEMO_URL } from "@/lib/site";

// Seule l'accueil est destinée à l'indexation ; les écrans interactifs sont en noindex (en-têtes, next.config.ts).
// Ils ne sont PAS bloqués ici : un robot doit pouvoir les lire pour voir le noindex.
// Les robots d'IA (recherche et entraînement) sont admis comme sur neuraweb.fr.
const PRIVATE = ["/api/"];
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // un groupe nommé n'hérite pas de « * » : on répète la liste privée
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${DEMO_URL}/sitemap.xml`,
    host: DEMO_URL,
  };
}
