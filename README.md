# Teste ton mot de passe

Petit site pour les collégiens du stand **CYBERTOUR Rouen 2026** : on écrit un mot de passe inventé,
le site affiche son niveau (de NUL à INCASSABLE), le temps qu'il faudrait à un pirate pour le trouver,
les 8 défis à réussir, et les numéros et sites utiles.

Pensé pour le téléphone. Aucun mot de passe n'est enregistré ni envoyé, et la page ne contacte aucun
autre site : polices et images sont dans le dossier.

## Mettre en ligne sur GitHub Pages (sans ligne de commande)

1. Sur github.com : **New repository**, un nom (par exemple `mot-de-passe`), **Public**, **Create repository**.
2. Clique sur le lien **uploading an existing file**.
3. Ouvre ce dossier, sélectionne **tout son contenu** (`Cmd + A`) et glisse-le dans la page.
   Glisse le contenu, pas le dossier : `index.html` doit être à la racine du dépôt.
4. Attends que les fichiers soient listés, puis **Commit changes**.
5. **Settings → Pages** : **Deploy from a branch**, branche **main**, dossier **/ (root)**, **Save**.
6. Une à deux minutes plus tard : `https://<ton-compte>.github.io/<nom-du-depot>/`.

## Tester sur son ordinateur

```bash
python3 -m http.server 8000
```

puis <http://localhost:8000>.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `css/style.css` | Le style |
| `css/fonts.css`, `fonts/` | Polices Bungee, Lexend, JetBrains Mono (SIL Open Font License) |
| `js/app.js` | L'analyse du mot de passe, les niveaux et les défis |
| `assets/` | Logo, partenaires, icône |

## Comment le niveau est calculé

Le site estime combien d'essais il faut pour trouver le mot de passe (mots de passe connus, prénoms,
mots du dictionnaire, dates, suites clavier, puis force brute), face à un pirate qui en teste
1 000 milliards par seconde.

| Niveau | Temps pour le trouver |
|---|---|
| NUL | moins d'une seconde |
| FAIBLE | moins d'un jour |
| MOYEN | moins de 100 ans |
| FORT | plus de 100 ans |
| INCASSABLE | plus de 100 ans **et** les 8 défis réussis |

## Crédits

Logo et bande partenaires : propriété des organisateurs du CYBERTOUR Rouen 2026 et de leurs partenaires.
