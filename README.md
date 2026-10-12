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

## Version 2 — modèle 3D enrichi (octobre 2026)

Le module `viewer.js` a été reconstruit autour de géométries Three.js, sans intégration privée à Kazaplan :

- Dimensions principales réinterprétées depuis les trois plans (emprise de 8,47 m au niveau supérieur, 6,83 m de profondeur à l'étage haut, 8,90 m pour le premier étage, selon les annotations transmises).
- Façades avec ouvertures traversantes, huisseries, volets verts, balustrades, toit incliné et rangées de tuiles, garage et porche à arc.
- Revêtements texturés générés localement (enduit, bois, carrelage et pierre), piscine sécurisée, terrasse, végétation.
- Plan en coupe meublé par niveau : chambres, cuisine, salle de bains, séjour, buanderie, garages. Le mobilier et la disposition restent **illustratifs**, pas des relevés.
- Consultation des photos originales directement depuis une pièce sélectionnée ; vue de dessus, affichage/masquage des meubles, cadrage sur une pièce, toiture affichable/masquable.

**Précision** : les murs extérieurs et les dimensions proviennent d'une reconstitution manuelle sur la base des captures fournies ; les détails non lisibles (allèges, position exacte des portes/fenêtres, élévations, escaliers, toiture) sont approximés. Cela reste un outil de présentation, et non un modèle BIM technique.

Kozikaza a fermé en 2025. Son successeur Kazaplan (Leroy Merlin) est un outil d'édition autonome ; ce site utilise Three.js sous licence libre pour fonctionner sans compte ni export propriétaire. Si un modèle GLB/GLTF exact est créé à l'avenir, il sera possible de le charger via Three.js.

## Mise à jour V3 — 12 octobre 2026

Le modèle Three.js publié comprend désormais des garages sans voiture, des rangements en fond de garage, un escalier en L avec palier et rambardes et une décoration enrichie du salon. Le code de la visite passe en version 3 avec des URLs de scripts renouvelées pour contourner le cache.


## Mise à jour V4 — architecture d'après plans et photos (12 octobre 2026)

Cette version privilégie **l'escalier, les percements et les volumes**, avant tout travail supplémentaire sur les meubles :

- **Escalier demi-tournant** dans une emprise voisine de 2,18 × 1,92 m, avec deux volées opposées, palier, nez de marche et rampes. La hauteur de marche est déduite des 2,70 m entre niveaux, sans prétendre à un relevé sur place. La version précédente en L débordait de la cage d'escalier représentée sur les plans.
- **Trémies traversantes** : les dalles du premier et du deuxième étages sont découpées à l'emplacement de la cage, au lieu de recouvrir les escaliers.
- **Cloisons et portes** : murs intérieurs hauts avec passages, coupe des murs à hauteur de plan, portes pleines et portes vitrées distinguées.
- **Ouvertures de façade** : huisseries, rails et meneaux de coulissants, fenêtres avec allèges, portes-fenêtres, volet de garage, porche ouvert et porte verte en retrait, volets extérieurs, ferronnerie.
- **Loggias et toitures secondaires** : correction de la baie de la loggia, des débords en tuiles et des bandeaux de façade.
- **Visite simplifiée** : mobilier masqué par défaut, bouton *Voir l'escalier*, sélection directe de la trémie et bouton de retour à la vue extérieure.
- **Cache de GitHub Pages** : script de maquette chargé via une URL versionnée `viewer.js?v=4-arch-20261012` pour que la nouvelle géométrie remplace la V3.

**Précision** : les plans fournis donnent des dimensions générales et la position des portes/fenêtres, mais pas tous les tableaux, appuis ni les relevés d'élévation. Les dimensions des menuiseries, la nature de certains ouvrants et l'escalier en U sont donc des **interprétations architecturales** à confirmer sur site. Ce modèle n'est pas un plan d'exécution.

Si GitHub Pages affiche une ancienne version, attendre la fin du déploiement puis effectuer un rafraîchissement forcé (`Ctrl+Maj+R` ou équivalent). Pour inspecter l'escalier, ouvrir « Premier étage » puis cliquer sur « Voir l'escalier ».


## Mise à jour V6 — escalier inversé et WC sous escalier (12 octobre 2026)

- Première marche au **côté droit**, après suppression de la petite cloison gênant le passage, puis escalier **quart-tournant à gauche** avec marches, palier et rampes.
- Le **WC du rez-de-chaussée** et son lave-mains sont ajoutés sous la volée haute, avec murets en coupe et photo `06-wc-rdc.jpg` sélectionnable depuis la maquette.
- Le bouton **Voir l’escalier** cadre le rez-de-chaussée pour montrer ensemble le départ et les toilettes.
- Fichiers HTML et JS versionnés V6 pour invalider l’ancien cache du navigateur.

Ces volumes restent une interprétation approximative des photos et plans, et ne constituent pas des cotes de travaux.


## Mise à jour V7 — escalier conforme au plan détaillé (12 octobre 2026)

Le détail coté de l'escalier a conduit à remplacer l'ancienne géométrie en L par un **véritable escalier demi-tournant à gauche, à marches balancées**, sans palier rectangulaire :

- **Départ à droite dans la volée supérieure du plan**, déplacement vers la gauche sur cinq marches ;
- **Huit marches en éventail** autour d'un pivot à gauche, puis **cinq marches de retour vers la droite** dans la volée inférieure du dessin ;
- Emprise du dessin d'environ **2,13 m × 1,77 m** (passages de 90 et 87 cm), au sein de la trémie conservée de **2,18 m × 1,92 m** ;
- Chaque marche est un volume polygonal à hauteur progressive, avec contremarche et nez de marche, et les deux volées sont munies de mains courantes ;
- **Toilettes replacées sous les marches tournantes, dans l'angle bas gauche du plan**, avec entrée côté escalier haut ;
- Mise à jour de la sélection des pièces, de la caméra « Voir l'escalier » et de la version du script en **V7** pour éviter l'ancienne 3D en cache.

Les 18 hauteurs de marche sont une représentation géométrique indicative et ne remplacent pas un relevé sur place.

## Mise à jour V9 — Rez-de-jardin et piscine taillés dans la roche (12 octobre 2026)

- Le **rez-de-jardin est construit dans la roche** : suppression de la grande pelouse fictive sous et derrière les garages ; substrat minéral et talus rocheux facettés visibles autour du bâtiment.
- La terrasse du niveau piscine possède désormais un soubassement rocheux jusqu'au niveau inférieur, avec faces de coupe apparentes.
- La piscine est **creusée dans le massif rocheux**, avec réservation dans le dallage, fond et parois de bassin, margelles et eau abaissée sous le niveau de la terrasse ; aucun vide fictif en dessous.
- L'ancien carré de gazon artificiel près du bassin est supprimé. La végétation décorative restante est placée en bacs sur la terrasse, pas dans un jardin au niveau bas.
- Les dispositions intérieures et le palier du premier étage (V8) sont conservés. Le relief représente visuellement l'encaissement, sans prétendre à un relevé géotechnique.

## Mise à jour V10 — Terrasse périphérique au premier étage (12 octobre 2026)

Correction à partir de la photographie annotée : le terrain inférieur reste rocheux, **mais une terrasse carrelée praticable s'étend au niveau du premier étage**, autour du bâtiment et jusqu'à la piscine. Le rendu V9 laissait erronément apparaître de la roche à la place du dallage au-dessus des garages.

- Dallage autour du bâtiment : passage arrière, bande latérale ouest, toit-terrasse du garage et retour en façade sur rue, raccordés aux dallages autour du bassin.
- Soubassement en roche conservé à l'extérieur sous les surfaces de terrasse ; les garages ne sont pas remplis de roche (toitures-dalles au-dessus des volumes existants).
- Garde-corps et murets bas ajoutés aux bords exposés, sans fermer les ouvertures du premier étage.
- Piscine toujours excavée dans la roche au niveau de la terrasse, eau et margelles conservées.
- Géométrie indicative : largeur de la circulation périphérique et des murets à ajuster selon relevé si besoin.

## Mise à jour V11 — chambre du rez-de-chaussée photographiée (12 octobre 2026)

- La pièce encadrée en jaune par le propriétaire, attenante aux WC sous escalier au **rez-de-chaussée**, est réinterprétée comme une **chambre** plutôt que comme la buanderie précédemment modélisée. L'étiquette historique « salle de bains » du plan est conservée comme réserve documentaire, la photo ayant priorité pour cette représentation.
- Sol en parquet chêne clair et mobilier Three.js détaillé : lit double avec tête de lit, matelas, deux oreillers, couette, plaid, tapis écru, deux chevets, éclairages, commode chêne et tiroirs crème, fleurs, diffuseur, store, rideaux de lin et suspension ajourée en fibres tressées.
- Meubles précédemment placés comme buanderie dans cette chambre retirés ; conservés : escalier, WC sous escalier et accès dégagés.
- Mobilier visible par défaut, avec possibilité de le masquer ; carte « Chambre aménagée » ouvrant directement le bon niveau et la photo correspondante dans la maquette.
- Script viewer.js versionné V11 pour recharger la nouvelle version sur GitHub Pages et actualiser la présentation.

**À confirmer** : affectation définitive de cette pièce et surface indicative issue du plan (11,8 m²). Les dimensions et positions précises de l'ameublement restent illustratives, à vérifier sur place.

## Mise à jour V12 — limite de terrasse et maison en contre-haut (12 octobre 2026)

- Limite de la terrasse conservée au bord de la propriété (jusqu'au muret côté droit de la piscine) : **aucun dallage prolongé vers la parcelle voisine**. Les bacs décoratifs du coin droit barré en rouge sont supprimés.
- À droite de la terrasse/piscine se trouve **une autre maison, sur un terrain plus élevé** : le terrain voisin plat/fictif est remplacé dans la scène 3D par un volume de maison sur une plateforme en contre-haut, séparée par un mur de soutènement.
- Le talus rocheux arrière est arrêté à la limite propre à la maison présentée. La maquette reste en pierre au rez-de-jardin, tandis que la piscine et les terrasses sont au niveau supérieur.
- La maison voisine est masquée lorsque l'on sélectionne un étage, pour faciliter l'inspection des pièces. Son aspect (dimensions, toiture, fenêtres) est **indicatif**, car seule sa présence et sa position en contre-haut sont confirmées.
- Invalidation du cache avec `viewer.js?v=12-terrasse-voisin-20261012`.
