import type { Metadata } from "next";
import { Launcher } from "@/components/launcher";
import { VERTICAL_LIST } from "@/lib/verticals";
import { HOME_FAQ } from "@/lib/faq";
import { DEMO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Démo d'application web et mobile connectées : hôtel, restaurant, mairie",
  description:
    "Testez en direct une démo NeuraWeb : back-office web et application mobile synchronisés en temps réel pour un hôtel, un restaurant ou une mairie. Données fictives.",
  alternates: { canonical: "/" },
  // Seule la page d'accueil est indexée ; les écrans interactifs sont en noindex (en-têtes dans next.config.ts).
  robots: { index: true, follow: true },
};

const ORG_ID = "https://neuraweb.fr/#organization";

// Données structurées : organisation, 3 applications web de démonstration, FAQ visible sur la page.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "NeuraWeb",
      url: "https://neuraweb.fr",
      logo: "https://neuraweb.fr/assets/neurawebW.png",
      description: "Agence web & IA française : sites, applications mobiles, automatisations et assistants IA pour les PME.",
    },
    {
      "@type": "WebSite",
      "@id": `${DEMO_URL}/#website`,
      url: DEMO_URL,
      name: "NeuraWeb Connected Suite",
      inLanguage: "fr-FR",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "ItemList",
      name: "Démos NeuraWeb Connected Suite",
      itemListElement: VERTICAL_LIST.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "WebApplication",
          name: `${v.name} — démo ${v.sector.toLowerCase()}`,
          url: `${DEMO_URL}/${v.slug}`,
          description: `${v.tagline}. Démonstration interactive, données fictives.`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, iOS, Android (PWA)",
          browserRequirements: "Navigateur récent",
          isAccessibleForFree: true,
          inLanguage: "fr-FR",
          creator: { "@id": ORG_ID },
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: HOME_FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Launcher />
    </>
  );
}
