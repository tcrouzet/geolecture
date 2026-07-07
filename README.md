# Géolecture

Application web en HTML, CSS et JavaScript natif. Aucun framework, aucune compilation et aucune installation de paquet.

## Lancer en local

```bash
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000`. Le petit serveur est nécessaire parce que les navigateurs bloquent les modules JavaScript lorsque la page est ouverte directement comme fichier.

Sans paramètre, la page affiche l’accueil avec le choix des histoires.

URLs directes :

- `http://localhost:8000/?balade=montpellier`
- `http://localhost:8000/?balade=nimes`

Pour parcourir le récit, utilisez le bouton « maison » pour placer le curseur au départ, puis cliquez sur la carte ou déplacez le curseur bleu près des balises dans l’ordre. Le dossier peut être publié tel quel sur GitHub Pages.

## Modifier les balades

Chaque balade est rangée dans son propre dossier :

- `balades/montpellier/texte.md`
- `balades/montpellier/images/`
- `balades/montpellier/parcours.js`
- `balades/montpellier/cover.jpg`

Même logique pour `balades/nimes/`.

Le catalogue des balades se trouve dans `balades/catalogue.js`, mais il ne contient plus les textes éditoriaux.

Le titre, la ville, l’auteur, l’image de couverture et le texte de présentation sont dans l’en-tête du fichier `texte.md` :

```md
---
ville: Montpellier
titre: Sortir
auteur: Thierry Crouzet
date: Juin 2017
image: cover.jpg
presentation: Cette géolecture...
---
```

Pour corriger un contenu, modifier le fichier `texte.md` de la balade concernée.
