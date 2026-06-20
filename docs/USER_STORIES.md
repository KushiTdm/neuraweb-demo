# User stories — NeuraWeb Connected Suite

> Cahier des cas d'usage qui pilote la maquette. Tout est simulé (données fictives, IA scriptée),
> mais les parcours et la logique de synchronisation web ↔ client sont réalistes.

## Principe d'architecture (corrigé)

| Vertical | Côté **client / usager** | Côté **établissement / agent** | Pourquoi |
|---|---|---|---|
| **Collectivité** | **Application mobile** citoyenne (`PhoneFrame`) | Back-office mairie (web) | Une collectivité a légitimement une app installée (services au quotidien). |
| **Restaurant** | **Site web** client (`BrowserFrame`, accès QR/lien) | Back-office responsable (web) | Personne ne télécharge une app pour un seul resto → commande via site web mobile. |
| **Hôtel** | **Site web** voyageur (`BrowserFrame`) | Back-office réception (web) | Idem : réservation/séjour gérés via site web, pas une app dédiée. |

**Règle de confidentialité (transverse).** Un usager ne voit **que ses propres** données
(signalements, démarches, commandes, réservations). Le back-office, lui, a la vue d'ensemble
(c'est son rôle métier). L'usager démo est identifié « Vous (… démo) ».

**Synchronisation temps réel (transverse).** Toute action côté usager remonte instantanément au
back-office ; toute validation/changement de statut côté back-office notifie instantanément l'usager.
Bidirectionnel, via un état partagé (store Zustand).

---

## 1. Collectivité — « Ville de Néauville »

### Personas
- **Camille, citoyenne** — utilise l'app mobile pour la vie quotidienne (signaler, réserver, démarches).
- **Marc, agent d'accueil / services techniques** — traite les demandes depuis le back-office.

### Citoyen (app mobile)
- **US-C1 — Signaler un problème.** En tant que citoyen, je prends une photo, choisis une catégorie
  (voirie, éclairage, propreté, espaces verts), localise (GPS simulé) et j'envoie.
  *AC :* le signalement apparaît aussitôt dans la console mairie (badge « Nouveau ») ; je suis
  son avancement (Envoyé → Reçu → En cours → Résolu) et reçois une notification à chaque étape.
- **US-C2 — Mes démarches (confidentialité).** En tant que citoyen, je vois **uniquement mes
  démarches** et peux en **initier une nouvelle** (acte d'état civil, urbanisme, inscription…).
  *AC :* aucune démarche d'un autre usager n'est visible côté app ; chaque démarche affiche un
  statut (Déposé → En instruction → Complément demandé → Validé). *(Corrige le bug de fuite de données.)*
- **US-C3 — Réserver un équipement.** Je réserve salle/gymnase/atelier sur un créneau.
  *AC :* la demande arrive en mairie ; quand l'agent valide/refuse, je suis notifié.
- **US-C4 — Vie de la ville.** Sur l'accueil, je parcours un **carrousel horizontal** d'animations,
  événements et actualités, puis le détail. *AC :* défilement fluide, cartes compactes, accès rapides.
- **US-C5 — Notifications.** Je reçois les suivis de mes demandes (push simulées) dans l'agenda.

### Agent (back-office web)
- **US-CA1 — Signalements.** Je vois **tous** les signalements (liste + carte), filtre par catégorie,
  recherche, **assigne** à un service et **change le statut**. *AC :* sync vers l'app citoyen.
- **US-CA2 — Réservations.** Je **valide/refuse** les demandes de salles. *AC :* notif citoyen.
- **US-CA3 — Démarches.** Je suis l'ensemble des dossiers (vue service, multi-usagers — c'est le métier).
- **US-CA4 — Conformité.** Je consulte RGAA/RGPD/transparence IA (différenciateur secteur public).

---

## 2. Restaurant — « La Table d'Henri » *(client = site web)*

### Personas
- **Julie, cliente** — scanne le QR sur la table / la devanture, commande sur le **site web** mobile.
- **Henri, responsable** — pilote commandes, salle, carte et prix depuis le back-office.

### Client (site web)
- **US-R1 — Commander en click & collect.** Je parcours la carte, j'ajoute au panier, je paie
  (paiement **simulé**) et je choisis un créneau. *AC :* je reçois un **code de retrait à 4 chiffres** ;
  la commande part en statut **« En attente de confirmation »**.
- **US-R2 — Suivre ma commande.** Je suis l'état en temps réel : En attente → **Confirmée** →
  En préparation → Prête → Récupérée (ou **Refusée** avec motif). *AC :* mise à jour instantanée
  quand le restaurant agit ; notification à chaque étape.
- **US-R3 — Réserver une table.** Date, heure, couverts. *AC :* demande envoyée, le resto valide/refuse.

### Responsable (back-office web)
- **US-RA1 — Accepter/Refuser les commandes.** Je reçois chaque commande (« En attente »), je
  l'**accepte** (→ préparation) ou la **refuse**. *AC :* le client est notifié ; refus = motif.
- **US-RA2 — Avancer la préparation.** Je passe En préparation → Prête → Récupérée (écran cuisine).
- **US-RA3 — Réservations de table.** Je **valide/refuse** les demandes. *AC :* notif client.
- **US-RA4 — Carte & prix.** Je gère plats, **prix**, et active une **promo anti-gaspillage** en un clic.
- **US-RA5 — Pilotage.** KPI (CA, panier moyen, commandes en cours, économies vs plateformes), fidélité.

---

## 3. Hôtel — « Hôtel Lumen » *(client = site web)*

### Personas
- **Claire, voyageuse** — réserve et gère son séjour depuis le **site web** de l'hôtel.
- **Sofia, réception/manager** — valide les réservations et pilote l'exploitation.

### Voyageur (site web)
- **US-H1 — Réserver une chambre.** Je choisis dates et type de chambre, je paie (simulé).
  *AC :* la réservation part en **« Demande » (en attente de validation)**.
- **US-H2 — Suivre ma réservation & mon séjour.** Je vois le statut (Demande → **Confirmée** /
  Refusée). Une fois confirmée, je fais mon **check-in en ligne** (débloque la **clé digitale**).
  *AC :* le check-in prévient la réception ; statuts synchronisés.
- **US-H3 — Services pendant le séjour.** Je demande room service / late check-out / taxi / spa et
  suis l'avancement. *AC :* la demande tombe en conciergerie ; je suis notifié quand c'est traité.

### Réception / manager (back-office web)
- **US-HA1 — Valider/Refuser les réservations.** Je reçois chaque demande et la **valide** (→ confirmée)
  ou la **refuse**. *AC :* notif voyageur.
- **US-HA2 — Planning des chambres.** Je vois/établis les statuts (Libre / Occupée / Ménage), check-in/out.
- **US-HA3 — Conciergerie.** Je prends en charge et termine les demandes de service. *AC :* notif voyageur.
- **US-HA4 — Tarifs & disponibilités.** Je consulte/gère la grille tarifaire.

---

## Matrice de synchronisation (le « waouh »)

| Vertical | Usager → Back-office | Back-office → Usager |
|---|---|---|
| Collectivité | signalement, réservation salle, démarche | assignation/statut, validation salle → notif app |
| Restaurant | commande (en attente), réservation table | **accept/refus** + avancement → notif site client |
| Hôtel | réservation (demande), check-in, demande service | **validation/refus** résa, avancement service → notif site client |

Le **Mode présentation** rejoue automatiquement un de ces parcours par vertical, mains-libres.
