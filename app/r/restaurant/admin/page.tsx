import type { Metadata } from "next";
import { StandaloneAdmin } from "@/components/standalone";
import { RestaurantAdmin } from "@/components/verticals/restaurant/admin";

export const metadata: Metadata = { title: "Cockpit cuisine — Back-office" };

export default function Page() {
  return (
    <StandaloneAdmin vertical="restaurant">
      <RestaurantAdmin standalone />
    </StandaloneAdmin>
  );
}
