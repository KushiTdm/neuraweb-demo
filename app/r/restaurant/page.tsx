import type { Metadata } from "next";
import { HubShell } from "@/components/hub-shell";
import { RestaurantAdmin } from "@/components/verticals/restaurant/admin";
import { RestaurantSite } from "@/components/verticals/restaurant/app";

export const metadata: Metadata = {
  title: "Restaurant — La Table d'Henri",
  description: "Back-office responsable + site web client connectés en temps réel. Démo NeuraWeb.",
};

export default function RestaurantHub() {
  return <HubShell vertical="restaurant" admin={<RestaurantAdmin />} client={<RestaurantSite />} />;
}
