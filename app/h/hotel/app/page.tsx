import type { Metadata } from "next";
import { StandaloneApp } from "@/components/standalone";
import { HotelSite } from "@/components/verticals/hotel/app";

export const metadata: Metadata = { title: "Hôtel Lumen — Site web voyageur" };

export default function Page() {
  return (
    <StandaloneApp vertical="hotel">
      <HotelSite />
    </StandaloneApp>
  );
}
