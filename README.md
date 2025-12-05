# NIRD Quest - Simulation stratégique du numérique responsable

Application web éducative pour sensibiliser au numérique inclusif, responsable et durable.

## 🌐 Déploiement

### URL de Production
[À compléter après déploiement sur Vercel/Netlify/etc.]

### Déploiement Rapide

#### Option 1 : Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

#### Option 2 : Netlify
```bash
npm run build
# Déployer le dossier dist/ sur Netlify
```

#### Option 3 : GitHub Pages
```bash
npm run build
# Configurer GitHub Actions pour déployer dist/
```

## 🚀 Installation et lancement local

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Ouvrir dans le navigateur**
   L'application sera accessible à l'adresse affichée dans le terminal (généralement `http://localhost:5173`)

### Commandes disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production

## 📁 Structure du projet

- `src/` - Code source principal
  - `main.jsx` - Point d'entrée de l'application
  - `App.jsx` - Composant principal avec le router
  - `components/ui/` - Composants UI de base
  - `utils/` - Fonctions utilitaires
  - `api/` - Client API (localStorage backend)
- `Pages/` - Pages de l'application (4 chapitres)
- `Components/` - Composants réutilisables
  - `game/` - Système de gamification
  - `ai/` - Composants IA
  - `forum/` - Système de forum
  - `notifications/` - Système de notifications
  - `3d/` - Visualisation 3D
- `Layout.jsx` - Layout principal avec navigation

## ✨ Fonctionnalités Principales

### 🎮 Gamification
- Système de points et 7 niveaux de progression
- 20+ badges différents
- Défis hebdomadaires
- Suivi de progression détaillé

### 📚 Parcours Éducatif
- 4 chapitres interactifs avec quiz
- Scanner de diagnostic
- Visualisation 3D de la transformation

### 💬 Forum Communautaire
- Création de posts et réponses
- Système de likes et votes utiles
- Badges de réputation
- Recherche et filtres

### 🤖 Intelligence Artificielle
- Auto-catégorisation des posts
- Suggestions personnalisées
- Génération de scénarios dynamiques
- Analyse stratégique post-partie

### 🎯 Jeu de Simulation
- Scénarios réalistes
- Mode multijoueur
- Événements aléatoires
- Visualisation 3D interactive

## ⚙️ Configuration

### Stockage des Données
Les données sont stockées dans le **localStorage** du navigateur :
- Posts et réponses du forum
- Progression des chapitres
- Statistiques et badges
- Scores de simulation

**Note :** Les données persistent entre les sessions mais sont locales à chaque navigateur.

## 🛠️ Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool et serveur de développement
- **React Router** - Navigation entre les pages
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations et transitions
- **Lucide React** - Icônes
- **TanStack Query** - Gestion des données et cache

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Téléphones (mobile-first)
- 📱 Tablettes
- 💻 Ordinateurs

Les quiz et interactions sont adaptés pour le tactile.

## 📝 Notes

- Les données sont stockées dans le localStorage pour le développement
- Le projet utilise des alias de chemins (`@/`) pour simplifier les imports
- Toutes les fonctionnalités sont opérationnelles avec des données de démonstration

## 📄 Documentation Complète

Voir le fichier `RENDU.md` pour la documentation complète du projet avec toutes les features détaillées.

