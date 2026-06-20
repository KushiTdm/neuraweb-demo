import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { DemoBanner } from "@/components/demo-banner";
import { AssistantWidget } from "@/components/assistant-widget";
import { StoreHydrator } from "@/components/store-hydrator";
import { Toaster } from "@/components/toaster";
import { ContactDialog } from "@/components/contact-dialog";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://connected-suite.neuraweb.fr"),
  title: {
    default: "NeuraWeb Connected Suite — Démo web + mobile connectée",
    template: "%s · NeuraWeb Connected Suite",
  },
  description:
    "Maquette interactive NeuraWeb : back-office web et application mobile connectés en temps réel pour collectivités, restaurants et hôtels. Données fictives.",
  applicationName: "NeuraWeb Connected Suite",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "NeuraWeb Suite",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "NeuraWeb Connected Suite — démo web + mobile connectée",
    description:
      "Back-office et expérience client (app mobile ou site web) synchronisés en temps réel. Collectivité, restaurant, hôtel. Démo NeuraWeb.",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/assets/og.webp", width: 1672, height: 941, alt: "NeuraWeb Connected Suite" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuraWeb Connected Suite",
    description: "Démo web + mobile connectée en temps réel.",
    images: ["/assets/og.webp"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#070F26",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable} h-full`}>
      <body className="min-h-full antialiased">
        <StoreHydrator />
        <DemoBanner />
        {children}
        <AssistantWidget />
        <Toaster />
        <ContactDialog />
      </body>
    </html>
  );
}
