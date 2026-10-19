import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { DemoBanner } from "@/components/demo-banner";
import { AssistantWidget } from "@/components/assistant-widget";
import { StoreHydrator } from "@/components/store-hydrator";
import { Toaster } from "@/components/toaster";
import { ContactDialog } from "@/components/contact-dialog";
import { Attribution } from "@/components/attribution";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Fraunces Soft Black auto-hébergée (même fichier que le site : latin + vietnamien)
const fraunces = localFont({
  src: "./fonts/Fraunces-SoftBlack.woff2",
  variable: "--font-fraunces",
  weight: "900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://demo.neuraweb.fr"),
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
    siteName: "NeuraWeb Connected Suite",
    url: "/",
    images: [{ url: "/assets/og.png", width: 1200, height: 630, alt: "NeuraWeb Connected Suite : hôtel, restaurant et mairie reliés à une application mobile et à un back-office" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuraWeb Connected Suite",
    description: "Démo web + mobile connectée en temps réel.",
    images: ["/assets/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0a38",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bricolage.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Attribution />
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
