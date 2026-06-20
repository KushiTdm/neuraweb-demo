import type { Metadata } from "next";
import { StandaloneApp } from "@/components/standalone";
import { CollectiviteApp } from "@/components/verticals/collectivite/app";

export const metadata: Metadata = { title: "Néauville & moi — Application citoyenne" };

export default function Page() {
  return (
    <StandaloneApp vertical="collectivite">
      <CollectiviteApp />
    </StandaloneApp>
  );
}
