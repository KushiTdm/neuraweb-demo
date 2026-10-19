<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NeuraWeb Connected Suite — notes pour agents

Démo **entièrement mockée** (aucun back-end). Voir `README.md` pour l'architecture complète.

- **Source de vérité de l'état** : `lib/store.ts` (Zustand `persist` + `localStorage`, `skipHydration`
  réhydraté par `components/store-hydrator.tsx`). Les scénarios de synchro web ↔ mobile et le
  « Mode présentation » y vivent. Régénération des données : `makeSeed()` dans `lib/mocks.ts`.
- **Aucun lien mort** : par défaut, naviguer via `<DemoLink>` (→ `/demo` si pas de page réelle).
- **Temps relatif** : toujours via `<RelativeTime>` / `useMounted()` pour éviter les mismatchs
  d'hydratation (le store et `Date.now()` ne sont fiables que côté client).
- **Thème** : tokens dans `app/globals.css` (`@theme` Tailwind v4). Back-offices sombres, apps claires.
- **Vérifs** : `npm run typecheck && npm run lint && npm run build` doivent rester verts.
