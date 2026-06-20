import type { Metadata } from "next";
import { HubShell } from "@/components/hub-shell";
import { CollectiviteAdmin } from "@/components/verticals/collectivite/admin";
import { CollectiviteApp } from "@/components/verticals/collectivite/app";

export const metadata: Metadata = {
  title: "Collectivité — Ville de Néauville",
  description: "Back-office mairie + application citoyenne connectés en temps réel. Démo NeuraWeb.",
};

export default function CollectiviteHub() {
  return <HubShell vertical="collectivite" admin={<CollectiviteAdmin />} client={<CollectiviteApp />} />;
}
