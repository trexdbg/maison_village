# Maison Village — site de visite architecturale

Site statique en français pour présenter une maison de village : présentation, chiffres issus des plans, galerie de 16 photographies, 4 documents de plan et modèle architectural 3D interactif.

## Démo / publication GitHub Pages

1. Ouvrir le dépôt **Settings > Pages**.
2. Sélectionner **Deploy from a branch**, puis la branche **main** et le dossier **/ (root)**.
3. Valider. GitHub affiche l'adresse publiée après le déploiement, normalement `https://trexdbg.github.io/maison_village/`.
4. Laisser à GitHub quelques instants pour publier les changements.

Le projet ne demande **aucune étape de compilation** : GitHub Pages sert directement `index.html`. Les ressources sont toutes référencées par des chemins relatifs, compatibles avec l'URL `/maison_village/`.

## Utilisation

- **Visite 3D** : glisser pour tourner, faire défiler pour zoomer, choisir un des trois niveaux pour afficher les pièces colorées, cliquer sur une pièce pour lire ses informations. Boutons pour recentrer et afficher/masquer la toiture.
- **Plans** : onglets pour consulter les plans du RDC, du premier étage, du deuxième étage et la perspective de référence.
- **Galerie** : filtrer les photographies et les agrandir dans une visionneuse avec navigation au clavier.
- **Responsive** : affichage adapté aux mobiles et tablettes.

## Structure

```text
index.html           Page vitrine et modules
styles.css           Direction artistique responsive
app.js               Galerie, plan interactif, navigation
viewer.js            Maquette 3D via Three.js
assets/photos/       Photographies fournies (16 fichiers)
assets/plans/        Plans fournis (4 fichiers)
.nojekyll             Configuration Pages
```

## Source des données / précautions

Les surfaces affichées proviennent des plans transmis : séjour 24,4 m², cuisine 9,2 m², chambres 13,2, 11,9 et 12,4 m², salle de bains au deuxième étage 7,6 m², garage 35,3 m² et second garage 22,7 m², piscine 13,9 m² et terrasse 125,4 m² indiquées sur le document. Ces valeurs sont *indicatives* et ne constituent pas un métrage réglementaire, un diagnostic technique ni une garantie de surface.

Le modèle 3D est une **maquette schématique reconstruite à partir des documents fournis** : volumes, ouvertures, hauteurs, cloisonnement, position de la piscine et cour ne sont pas des relevés fiables. Ne pas utiliser comme plan d'exécution ou pour travaux.

La 3D utilise Three.js `0.162.0` depuis jsDelivr et requiert une connexion Internet ainsi qu'un navigateur compatible WebGL. Le site principal reste lisible même si le chargement 3D est indisponible.

Les photographies restent la propriété de leurs ayants droit ; ne les réutilisez pas sans autorisation. Ce dépôt et le site GitHub Pages sont publics.