# Rendu du Projet NIRD Quest

## 📋 Informations du Projet

**Nom du projet :** NIRD Quest - Simulation stratégique du numérique responsable  
**Type :** Application web éducative React  
**Date de rendu :** Décembre 2025

---

## 🌐 URL de l'Application

**URL de production :** https://exquisite-sorbet-a3a9de.netlify.app/

**Plateforme de déploiement :** Netlify

**Statut :** ✅ Application déployée et accessible publiquement

---

## 📦 Sources du Projet

**Lien de téléchargement des sources :** [À compléter - lien vers dépôt Git ou archive]

**Structure du projet :**
```
nuit_de_l-info/
├── src/                    # Code source principal
│   ├── main.jsx           # Point d'entrée
│   ├── App.jsx            # Composant racine avec routing
│   ├── api/               # Client API (localStorage backend)
│   ├── components/ui/     # Composants UI de base
│   └── utils/             # Fonctions utilitaires
├── Pages/                 # Pages de l'application
├── Components/            # Composants réutilisables
│   ├── game/             # Système de gamification
│   ├── ai/               # Composants IA
│   ├── forum/            # Système de forum
│   ├── notifications/    # Système de notifications
│   └── 3d/               # Visualisation 3D
├── Layout.jsx             # Layout principal
├── package.json          # Dépendances
└── vite.config.js        # Configuration Vite
```

---

## ✨ Features Réalisées

### 🎮 Système de Gamification Complet
- **Système de points et niveaux** : 7 niveaux de progression (Débutant·e → Légende NIRD)
- **Badges et récompenses** : 20+ badges différents pour récompenser les actions
- **Suivi de progression** : Barres de progression, statistiques détaillées
- **Défis hebdomadaires** : Défis variés pour maintenir l'engagement
- **Système de streaks** : Suivi des visites quotidiennes

### 📚 Parcours Éducatif en 4 Chapitres
1. **Chapitre 1 - Le Diagnostic** : Scanner interactif pour identifier les problèmes numériques
2. **Chapitre 2 - La Découverte NIRD** : Découverte des 3 piliers (Inclusion, Responsabilité, Durabilité)
3. **Chapitre 3 - L'Action** : Actions concrètes à mettre en place
4. **Chapitre 4 - Le Résultat** : Visualisation de la transformation avec vue 3D interactive

### 💬 Forum Communautaire Fonctionnel
- **Création de posts** : 5 catégories (Expérience, Question, Ressource, Bonne pratique, Suggestion)
- **Système de réponses** : Répondre aux posts et aux questions
- **Système de likes et votes utiles** : Engagement communautaire
- **Badges de réputation** : Système de réputation basé sur les contributions
- **Recherche et filtres** : Recherche par mots-clés et filtrage par catégorie
- **Données de démonstration** : 4 posts de démonstration avec réponses

### 🤖 Intelligence Artificielle Intégrée

#### IA du Forum
- **Auto-catégorisation** : Détection automatique de la catégorie des posts
- **Extraction de tags** : Identification automatique des thèmes NIRD (linux, écologie, vie privée, etc.)
- **Résumés automatiques** : Génération de résumés intelligents des posts
- **Suggestions personnalisées** : Recommandations de ressources basées sur l'activité
- **Score NIRD** : Évaluation de la pertinence du contenu (1-10)

#### IA du Jeu de Simulation
- **Génération de scénarios dynamiques** : 3 scénarios adaptés aux décisions précédentes
- **Conseils stratégiques** : Conseils contextuels pendant le jeu
- **Analyse post-partie** : Analyse complète avec note (A-D) et recommandations
- **Stratégies alternatives** : Suggestions de stratégies à essayer

### 🎯 Jeu de Simulation Stratégique
- **Scénarios réalistes** : 3 scénarios de base + génération dynamique
- **Système de scores** : Budget, Satisfaction, Autonomie, Écologie
- **Décisions impactantes** : Chaque choix affecte les différents scores
- **Événements aléatoires** : Événements qui modifient la partie
- **Mode multijoueur** : Création de sessions, lobby, résultats comparatifs
- **Visualisation 3D** : Vue isométrique de l'établissement qui évolue

### 📊 Suivi d'Impact
- **Tableau de bord établissement** : Visualisation des métriques
- **Calcul d'éco-score** : Score environnemental basé sur les actions
- **Graphiques de progression** : Visualisation de l'évolution
- **Statistiques détaillées** : Économies, réduction CO2, autonomie

### 🎨 Interface Utilisateur
- **Design moderne** : Interface avec Tailwind CSS et animations Framer Motion
- **Responsive design** : Adapté aux téléphones, tablettes et ordinateurs
- **Quiz adaptés mobile** : Boutons optimisés pour le tactile
- **Thème sombre** : Interface élégante avec gradients
- **Animations fluides** : Transitions et animations pour une meilleure UX

### 🔔 Système de Notifications
- **Notifications contextuelles** : Badges, niveaux, défis
- **Cloche de notifications** : Accès rapide aux notifications
- **Types variés** : Badges, level up, réponses forum, défis

### 🏆 Système de Badges Étendu
- **Badges de base** : Scanner, piliers NIRD, premier post, etc.
- **Badges étendus** : Badges avancés avec descriptions détaillées
- **Badges de simulation** : Récompenses pour les performances au jeu
- **Collection complète** : Vue d'ensemble de tous les badges obtenus

### 📱 Responsive et Accessible
- **Mobile-first** : Optimisé pour les petits écrans
- **Touch-friendly** : Boutons et zones de touch adaptés
- **Navigation intuitive** : Menu de navigation adaptatif
- **Accessibilité** : Contraste et tailles de texte adaptées

---

## 🛠️ Technologies Utilisées

- **React 18** : Framework JavaScript
- **Vite** : Build tool et serveur de développement
- **React Router** : Navigation entre les pages
- **Tailwind CSS** : Framework CSS utilitaire
- **Framer Motion** : Animations et transitions
- **Lucide React** : Icônes
- **TanStack Query** : Gestion des données et cache
- **LocalStorage** : Stockage local des données (posts, progression, stats)

---

## 🚀 Installation et Lancement Local

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
npm install
```

### Lancement en développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build pour production
```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

---

## 📝 Fonctionnalités Techniques

### Système de Stockage
- **LocalStorage backend** : Toutes les données sont stockées localement
- **Données de démonstration** : Posts et réponses pré-chargés
- **Persistance** : Les données persistent entre les sessions

### Configuration Vite
- **Alias de chemins** : `@/components`, `@/pages`, `@/utils`
- **Plugin personnalisé** : Résolution automatique des extensions
- **Optimisations** : Build optimisé pour la production

### Architecture
- **Composants modulaires** : Structure claire et réutilisable
- **Séparation des concerns** : Logique métier séparée de l'UI
- **State management** : React Query pour les données, useState pour l'UI

---

## 🎯 Points Forts du Projet

1. **Complétude** : Toutes les fonctionnalités demandées sont implémentées
2. **Expérience utilisateur** : Interface intuitive et engageante
3. **Gamification** : Système de récompenses motivant
4. **Intelligence artificielle** : IA fonctionnelle pour le forum et la simulation
5. **Responsive** : Parfaitement adapté à tous les écrans
6. **Performance** : Application rapide et optimisée
7. **Accessibilité** : Prise en compte de l'accessibilité

---

## 📸 Captures d'Écran

[À compléter avec des captures d'écran de l'application]

---

## 🔗 Liens Utiles

- **Documentation React** : https://react.dev
- **Documentation Vite** : https://vitejs.dev
- **Documentation Tailwind** : https://tailwindcss.com
- **Projet NIRD** : https://nird.forge.apps.education.fr

---

