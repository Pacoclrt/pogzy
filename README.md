# L'épreuve du mot de passe

Atelier de sensibilisation aux mots de passe pour collégiens, lycéens et étudiants,
créé pour le stand du **CYBERTOUR Rouen 2026** (vendredi 9 octobre 2026, Seine Innopolis, Le Petit-Quevilly).

> Le site de ton club vient d'être piraté. Le pirate « Crochet » essaie mille milliards de combinaisons
> par seconde. Crée un mot de passe qu'il ne cassera pas.

Site statique : HTML, CSS et JavaScript, sans framework, sans étape de compilation.

## Mettre en ligne sur GitHub Pages

1. Crée un dépôt sur GitHub (public, ou privé avec un compte qui autorise Pages).
2. Envoie ce dossier :
   ```bash
   git remote add origin https://github.com/<utilisateur>/<depot>.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment**, source **Deploy from a branch**,
   branche **main**, dossier **/ (root)**, puis **Save**.
4. Le site est en ligne après une à deux minutes à l'adresse `https://<utilisateur>.github.io/<depot>/`.

## Tester sur son ordinateur

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>. Un double-clic sur `index.html` fonctionne aussi.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `css/style.css` | La charte (couleurs CYBERTOUR, thèmes clair et sombre) |
| `css/fonts.css`, `fonts/` | Polices hébergées dans le dépôt |
| `js/app.js` | Le jeu : analyse du mot de passe, règles, scénario, défi, quiz, mode vitrine |
| `js/qrcode.min.js` | Génération du QR code |
| `assets/` | Logo, bande partenaires, favicon |

## Fonctionnalités

- Analyse en direct : ce que la machine reconnaît (prénom, date, suite clavier…) et le temps de cassage
- Onze règles qui se débloquent une par une, tirées des recommandations ANSSI, CNIL et Cybermalveillance
- Scénario : Nora (cellule cyber) guide, Crochet (le pirate) se moque des mots de passe faibles
- Domino de la réutilisation, quiz de débriefing, défi 60 secondes
- Mode vitrine : démonstration automatique après 30 secondes d'inactivité
- QR code vers le jeu pour rejouer sur son téléphone
- Panneau animateur : `Ctrl + Alt + A`

## Réglages

En haut de `js/app.js` :

```js
var QR_FALLBACK="https://www.cybermalveillance.gouv.fr"; // QR quand la page est ouverte hors ligne
var RATE=1e12;                                          // essais par seconde de l'attaquant
var ATTRACT_DELAY=30000;                                // inactivité avant la démonstration (ms)
```

## Vie privée

Aucun mot de passe saisi ne quitte le navigateur. La page ne fait aucune requête vers un service tiers :
polices et bibliothèques sont hébergées dans le dépôt. Le compteur du jour (nombre d'essais, comptes sauvés,
meilleur score) est stocké uniquement dans le navigateur de l'appareil, jamais les mots de passe.
Les liens d'aide renvoient vers les sites officiels uniquement quand on clique dessus.

## Crédits

- Logo et bande partenaires : propriété des organisateurs du CYBERTOUR Rouen 2026 (Normandie Numérique,
  Campus Normandie Cyber) et de leurs partenaires. Ne pas réutiliser hors de l'événement.
- Polices : Libre Franklin, Public Sans, IBM Plex Mono, sous licence SIL Open Font License 1.1.
- QR code : [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) de Kazuhiko Arase, licence MIT.
- Crochet, Nora et la « cellule cyber » sont des personnages inventés.
