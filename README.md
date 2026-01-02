# Arbre Généalogique

Application web interactive pour créer et gérer des arbres généalogiques avec React Flow.

## Fonctionnalités

- **Gestion de projets** : Créer, éditer et supprimer plusieurs projets d'arbres généalogiques
- **Arbre interactif** : Interface drag-and-drop avec React Flow
- **Fiches détaillées** : Informations complètes pour chaque personne (dates, profession, propriétés)
- **Index de décès** : Numérotation automatique des personnes décédées par ordre chronologique
- **Relations visuelles** : Liens de mariage (or/💍) et de filiation (bleu) clairement différenciés
- **Export** : Génération d'images PNG et PDF haute qualité
- **Minimap** : Navigation facilitée avec carte miniature cliquable
- **Persistence** : Sauvegarde automatique des données

## Technologies

- **React 19.2** avec Vite
- **@xyflow/react** pour les diagrammes interactifs
- **Zustand** pour la gestion d'état
- **Supabase** pour la persistance des données
- **Tailwind CSS** pour le style
- **html-to-image** & **jsPDF** pour l'export

## Installation

\`\`\`bash
npm install
\`\`\`

## Développement

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## TODOs

- Placer les nouvelles nodes au centre de la vue
