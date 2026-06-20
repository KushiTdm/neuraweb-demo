import type { Metadata } from "next";
import { StandaloneAdmin } from "@/components/standalone";
import { HotelAdmin } from "@/components/verticals/hotel/admin";

export const metadata: Metadata = { title: "Console réception — Back-office" };

export default function Page() {
  return (
    <StandaloneAdmin vertical="hotel">
      <HotelAdmin standalone />
    </StandaloneAdmin>
  );
}
