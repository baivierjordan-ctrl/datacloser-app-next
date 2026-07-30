# Brancher le front sur les vraies données

Le front lit les leads via une petite API Python qui expose
`db_manager.py` — aucune logique métier n'est réécrite.

## 1. Lancer l'API (dans le dossier dr-jobai-saas)

Copier `api.py` à la racine du projet Python, puis :

```bash
pip install fastapi uvicorn
uvicorn api:app --reload --port 8000
```

Vérifier : http://localhost:8000/sante doit répondre
`{"statut":"ok","supabase":true}`

Les variables d'environnement Supabase doivent être présentes
(mêmes valeurs que pour l'app Streamlit).

## 2. Lancer le front

```bash
npm run dev
```

http://localhost:3000 → l'écran Radar charge le scan le plus récent
du compte défini dans `app/radar/page.tsx` (constante `COMPTE`).

## Comportement

| Situation | Affichage |
|---|---|
| API joignable, scans présents | Les vrais leads |
| API joignable, aucun scan | Jeu de démonstration + bandeau orange |
| API injoignable | Jeu de démonstration + bandeau rouge |

Le front ne casse jamais : il bascule sur les données de démonstration
et le signale clairement.

## Points d'entrée

- `GET /sante` — état de l'API
- `GET /scans?user_email=` — liste des exports disponibles
- `GET /leads?user_email=&fichier=` — leads d'un scan (le plus récent par défaut)
- `GET /credits?user_email=` — solde de crédits

## Déployer sur Render

Nouveau service Web, même dépôt que l'app Python :

- Build : `pip install -r requirements.txt`
- Start : `uvicorn api:app --host 0.0.0.0 --port $PORT`
- Variable : `CORS_ORIGINS=https://votre-front.vercel.app`

Ajouter `fastapi` et `uvicorn` à `requirements.txt`.
