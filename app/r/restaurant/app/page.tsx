import type { Metadata } from "next";
import { StandaloneApp } from "@/components/standalone";
import { RestaurantSite } from "@/components/verticals/restaurant/app";

export const metadata: Metadata = { title: "La Table d'Henri — Site web client" };

export default function Page() {
  return (
    <StandaloneApp vertical="restaurant">
      <RestaurantSite />
    </StandaloneApp>
  );
}
