import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Écrans interactifs (maquettes) : suivis mais non indexés. Seule l'accueil porte le texte à référencer.
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, follow" }];
    return ["/r/:path*", "/c/:path*", "/h/:path*", "/demo"].map((source) => ({ source, headers: noindex }));
  },
};

export default nextConfig;
