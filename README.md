# NeuraWeb Connected Suite — démo web + mobile connectée

Maquette interactive haute fidélité illustrant le savoir-faire NeuraWeb : pour **3 métiers**
(collectivité, restaurant, hôtel), un **back-office** et une **expérience client** partageant
le **même état** pour démontrer une **synchronisation temps réel**.

La surface client dépend du métier (voir [docs/USER_STORIES.md](docs/USER_STORIES.md)) :
- **Collectivité** → application mobile citoyenne (`PhoneFrame`).
- **Restaurant / Hôtel** → **site web** client (`BrowserFrame`) : on ne télécharge pas une app
  pour un seul resto/hôtel. L'établissement, lui, dispose du back-office (valider/refuser, gérer).

> 🧪 **Tout est mocké** — aucune donnée réelle, aucun back-end, aucun appel externe payant.
> L'IA est simulée (réponses scriptées + latence). Démo à but commercial / d'illustration.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production (Turbopack)
npm run start      # sert le build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Déploiement — sous-domaine Vercel (`demo.neuraweb.fr`)

La démo se déploie comme un **projet Vercel distinct** du site principal (`neuraweb.fr`),
servi sur le sous-domaine `demo.neuraweb.fr`.

1. **Nouveau projet Vercel** pointant sur ce dossier (`appMobile/`). Si le repo est un monorepo,
   régler *Settings → Build & Development → Root Directory* = `appMobile`. Build `next build`
   (Turbopack par défaut), aucune variable d'env requise (tout est mocké).
2. **Domaine** : *Settings → Domains → Add* `demo.neuraweb.fr`.
3. **DNS** (chez le registrar de `neuraweb.fr`) : ajouter `CNAME  demo  →  cname.vercel-dns.com`
   (valeur exacte affichée par Vercel). L'apex `neuraweb.fr` reste sur le projet principal —
   aucun conflit, le sous-domaine est indépendant. SSL auto-provisionné par Vercel.
4. **Côté site principal** : l'URL est centralisée dans `project/lib/site-config.ts`
   (`DEMO_URL = 'https://demo.neuraweb.fr'`), consommée par `project/components/demo-cta.tsx`
   et le header. Changer de sous-domaine = modifier cette seule constante.

> Le middleware `proxy.ts` et la redirection `www→apex` du site principal ne s'appliquent qu'à
> l'hôte `neuraweb.fr` : ils n'affectent pas `demo.neuraweb.fr`.

## Stack (2026)

- **Next.js 16** (App Router, **Turbopack** par défaut) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (moteur Oxide, thème CSS-first dans `app/globals.css`)
- **Zustand v5** (`persist` + `localStorage`) — store partagé = cœur de la synchro
- **motion** (Framer Motion v12) · **lucide-react** · composants shadcn-style écrits à la main
- **PWA** : manifest + service worker minimal (`public/sw.js`), installable

## Architecture

```
/                          Launcher (choix du secteur)
/demo                      Page stub « fonctionnalité de démonstration »
/c/collectivite            Hub Collectivité (Split View : back-office + app)
/c/collectivite/admin      Back-office mairie seul
/c/collectivite/app        Application citoyenne seule
/r/restaurant…             idem Restaurant (KDS + app client)
/h/hotel…                  idem Hôtel (réception + app voyageur)
```

- **`lib/store.ts`** — store Zustand unique : toutes les actions de synchro + le « Mode présentation ».
- **`lib/mocks.ts`** — `makeSeed()` régénère un jeu de données frais (et au reset).
- **`components/`** — transverses (`SplitView`, `PhoneFrame`, `DemoLink`, `DemoBanner`,
  `AssistantWidget`, `NotificationBell`/`LiveToast`, `ActivityFeed`, `presentation-mode`…).
- **`components/verticals/<v>/{admin,app}.tsx`** — back-office + app de chaque métier.

## La démonstration « connectée »

Dans chaque hub, agissez sur le **téléphone** → l'action remonte **instantanément** dans le
back-office (et inversement), avec changements de statut, badges « Nouveau », notifications et
toasts simulés. Scénarios bidirectionnels par métier :

| Métier | Client → Back-office | Back-office → Client |
|---|---|---|
| Collectivité | signalement, réservation salle, démarche (app) | assignation/statut + notif app |
| Restaurant | commande (en attente), réservation table (site web) | **accepter/refuser** + avancement → suivi client + code |
| Hôtel | réservation (demande), check-in, demande service (site web) | **valider/refuser** résa + avancement service → notif voyageur |

Le bouton **« Mode présentation »** (barre du hub) joue un scénario automatiquement, mains-libres.

## Règle d'or : aucun lien mort

Tout élément cliquable aboutit. À défaut de page réelle, `<DemoLink>` redirige vers
`/demo?feature=…&from=…` (page stub soignée). Le bandeau **« Réinitialiser la démo »** remet les
mocks d'origine.

## Identité

Palette NeuraWeb (`app/globals.css`) : navy `#070F26`/`#0E1B3D`, sky `#5DB8F0`, cyan `#22D3EE`,
coral `#FF7A59`, lime `#C5F277`. Back-offices en **sombre**, apps mobiles en **clair**. Accents
secondaires : Collectivité = indigo, Restaurant = amber, Hôtel = teal.
