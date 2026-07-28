// ============================================================
// lib/supabase-server.ts
// Client Supabase côté serveur (service role) pour l'insert des
// sollicitations de la démo dans `demo_leads` (bypass RLS).
//
// ⚠️ NE JAMAIS importer ce module depuis un composant client.
// La SERVICE ROLE KEY contourne toutes les policies — usage serveur only.
// (Miroir de project/lib/supabase-server.ts — même projet Supabase.)
// ============================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Renvoie un client Supabase service-role mémoïsé.
 * Renvoie `null` si les variables d'env ne sont pas configurées — les
 * appelants doivent gérer ce cas (best-effort, ne pas planter la requête).
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn(
      "[supabase-server] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant — Supabase désactivé.",
    );
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
