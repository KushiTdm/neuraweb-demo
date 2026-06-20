import type { Metadata } from "next";
import { HubShell } from "@/components/hub-shell";
import { HotelAdmin } from "@/components/verticals/hotel/admin";
import { HotelSite } from "@/components/verticals/hotel/app";

export const metadata: Metadata = {
  title: "Hôtel — Hôtel Lumen",
  description: "Console réception + site web voyageur connectés en temps réel. Démo NeuraWeb.",
};

export default function HotelHub() {
  return <HubShell vertical="hotel" admin={<HotelAdmin />} client={<HotelSite />} />;
}
