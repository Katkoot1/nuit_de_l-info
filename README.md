# NIRD Quest - Simulation stratégique du numérique responsable

Application web éducative pour sensibiliser au numérique inclusif, responsable et durable.

## 🚀 Installation et lancement

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
  - `api/` - Client API (Base44)
- `Pages/` - Pages de l'application
- `Components/` - Composants réutilisables
- `Layout.js` - Layout principal avec navigation

## ⚙️ Configuration

### API Base44
Le client API Base44 est configuré dans `src/api/base44Client.js`. 
**Important**: Vous devrez configurer les vraies credentials de l'API Base44 pour que les fonctionnalités backend fonctionnent.

Actuellement, le client utilise des stubs (simulations) pour le développement local.

## 🛠️ Technologies utilisées

- React 18
- React Router
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- TanStack Query
- Recharts

## 📝 Notes

- Les données sont actuellement stockées dans le localStorage pour le développement
- L'API Base44 doit être configurée pour les fonctionnalités complètes
- Le projet utilise des alias de chemins (`@/`) pour simplifier les imports

