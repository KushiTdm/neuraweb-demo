# Démo NeuraWeb — canaux de vente et référencement (19 octobre 2026)

Sources : recherche search-ai (6 IA, brief `/Users/Dev/ai-search-results/research/20261019-144603_*.md`) + brainstorm (3 IA, 19/10/2026). Ce sont des synthèses d'IA : les points « consensus » sont les plus fiables, les chiffres de taux de réponse (Loom, etc.) ne sont **pas sourcés** et ne doivent pas être cités.

## 1. Canaux de vente, par ordre de priorité
1. **Lien de démo dans chaque devis et chaque réponse à un prospect** (le plus rentable, coût nul). Utiliser un lien suivi : `https://demo.neuraweb.fr/?utm_source=devis&utm_campaign=<secteur>&prospect=<nom>`. L'origine est mémorisée pendant la visite et ajoutée automatiquement au champ « contexte » de la demande de contact (lead).
2. **Bouton « Voir la démo » sur les pages secteurs de neuraweb.fr** (Santé, Restaurants & hôtels, Collectivités) vers la démo correspondante (`/r/restaurant`, `/h/hotel`, `/c/collectivite`) : le visiteur est déjà qualifié.
3. **Prospection directe courte** (e-mail, X, Facebook, pas de LinkedIn) : 3 lignes + lien de la démo du secteur + éventuellement une vidéo de 60 s du « mode présentation ». Une démo par secteur, jamais une démo générique.
4. **Vidéo courte du mode présentation** (60–90 s) à joindre aux e-mails et à publier sur X/Facebook.
5. **QR code** sur support imprimé (carte, plaquette, salons locaux) vers la démo du secteur.
Écartés (consensus) : Product Hunt et plateformes assimilées, peu adaptés à une prestation de service B2B locale.

## 2. SEO et référencement par les IA (GEO)
- **Indexer l'accueil, pas les écrans interactifs.** Fait : l'accueil est `index, follow` avec un vrai texte (H1, secteurs, cas d'usage, FAQ) ; `/r/*`, `/c/*`, `/h/*` et `/demo` répondent `X-Robots-Tag: noindex, follow` (en-têtes dans `next.config.ts`). Les robots ne sont pas bloqués dans `robots.txt`, sinon ils ne verraient pas le noindex.
- **Les moteurs et les IA ne lisent pas une maquette interactive** : tout ce qui doit être cité est du texte sur l'accueil.
- **Données structurées** (accueil) : `Organization`, `WebSite`, `ItemList` de trois `WebApplication` (gratuites, démonstration), `FAQPage` (FAQ visible, même source `lib/faq.ts`). Pas d'`Offer` : on n'affiche pas de prix sur la démo.
- **Robots d'IA admis** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…), comme sur neuraweb.fr. `public/llms.txt` ajouté (un seul `#`). Son effet n'est pas prouvé (DeepSeek/Grok : non utilisé par Google ; Gemini : utile) : coût nul, impact non garanti.
- **Sous-domaine ou sous-dossier ?** Désaccord entre les IA. Recommandation : garder `demo.neuraweb.fr` (application Next.js séparée) et compenser par un **maillage fort depuis neuraweb.fr** (pages secteurs, blog, pied de page) ; une page d'atterrissage texte peut ensuite être créée sous `neuraweb.fr/fr/demos`, qui pointe vers le sous-domaine.
- **À faire côté neuraweb.fr** (non fait, hors de la démo) : lien « Voir la démo » depuis les trois pages secteurs et depuis l'accueil ; article de blog « démo d'une application pour un hôtel / restaurant / mairie » avec lien.
- **À faire côté Search Console** : ajouter `demo.neuraweb.fr` (propriété de domaine déjà couverte par `sc-domain:neuraweb.fr`), soumettre `https://demo.neuraweb.fr/sitemap.xml`, puis « Demander l'indexation » de l'accueil.
- **Démos personnalisées par client** : toujours en `noindex` (ne jamais les mettre dans le sitemap).

## 3. Identité visuelle de la démo
- Palette Rich Blue `#191265` / Pale Gray `#EBEBDF` ; H1 Fraunces Soft Black, H2–H6 Bricolage Grotesque, texte Inter (mêmes polices que neuraweb.fr).
- Icônes : set maison (`components/brand/icons.tsx`, trait 2,2 px, grille 32 px) pour hôtel / restaurant / mairie / connexion, bulle et trois points animés du chatbot (`ChatLauncherIcon`), lucide forcé à 2,2 px (`.lucide` dans `globals.css`).
- Illustrations : isométrie en trait monochrome (Gemini), `public/assets/demo-*.webp` + `og.png` (1200×630). Prompts : trait arrondi, Rich Blue sur Pale Gray, accent périwinkle, sans texte ni personnage.
- Bouton contact unique : `ContactButton` (bulle + libellé), bouton plein Pale Gray ; même couleur pour les boutons principaux, l'assistant et le formulaire.
