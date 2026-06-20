import type { Metadata } from "next";
import { StandaloneAdmin } from "@/components/standalone";
import { CollectiviteAdmin } from "@/components/verticals/collectivite/admin";

export const metadata: Metadata = { title: "Console mairie — Back-office" };

export default function Page() {
  return (
    <StandaloneAdmin vertical="collectivite">
      <CollectiviteAdmin standalone />
    </StandaloneAdmin>
  );
}
