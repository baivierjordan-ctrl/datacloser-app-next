# DataCloser — interface Next.js

Portage progressif de l'interface DataCloser depuis Streamlit vers
Next.js 15 + TypeScript.

## Pourquoi

L'application actuelle (`app_web.py`, Streamlit) fonctionne mais
présente trois limites structurelles :

- l'état vit en `session_state` et disparaît à chaque redéploiement ;
- les clés de widgets indexées par position provoquent des collisions
  quand la liste change ;
- chaque interaction relance le script complet côté serveur.

React résout ces trois points par construction.

## Ce qui est porté

- [x] Écran **Radar** — résultats de scan, filtres, sélection, accroches
- [ ] Authentification (Supabase Auth)
- [ ] Exports & CRM
- [ ] Outreach
- [ ] Link Building

La logique métier Python (`db_manager.py`, `brain.py`, `enricher.py`,
`mailer.py`, workers) n'est **pas** réécrite : elle sera exposée via une
API FastAPI et consommée depuis ce front.

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
```

Ouvrir http://localhost:3000 — redirige vers `/radar`.

## Structure

```
app/
  layout.tsx        Layout racine, polices, métadonnées
  globals.css       Charte DataCloser en variables Tailwind v4
  radar/page.tsx    Écran Radar
components/
  LigneLead.tsx     Une ligne de résultat, dépliable
  BarreScore.tsx    Jauge de pertinence en 10 segments
  BarreFiltres.tsx  Score minimum, emails vérifiés
  BarreActions.tsx  Sélection, export, lancement de campagne
lib/
  types.ts          Types du domaine
  donnees-demo.ts   Jeu de démonstration (à remplacer par l'API)
```

## Charte

Définie une seule fois dans `app/globals.css` sous `@theme`, puis
utilisée en classes utilitaires (`bg-ink`, `text-teal`, `border-line`).

| Rôle | Valeur |
|---|---|
| Fond | `#0a0d12` |
| Cartes | `#0d1117` |
| Bordures | `#1e2530` |
| Accent | `#00e5b0` |
| Texte | `#e6edf3` |

Polices : Inter (interface), JetBrains Mono (données et libellés techniques).

## Prochaine étape

Exposer `db_manager.py` derrière FastAPI et remplacer `donnees-demo.ts`
par un appel réel.
