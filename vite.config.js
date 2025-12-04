import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin pour résoudre correctement les alias @/components et @/pages
const resolveAliases = () => {
  return {
    name: 'resolve-aliases',
    enforce: 'pre',
    resolveId(id, importer) {
      // Résoudre @/components/ui/... vers src/components/ui/... (composants UI)
      if (id.startsWith('@/components/ui/')) {
        const relPath = id.replace('@/components/ui/', '');
        const fullPath = path.resolve(__dirname, './src/components/ui', relPath);
        
        const extensions = ['.jsx', '.js', '.tsx', '.ts', '.json'];
        for (const ext of extensions) {
          const withExt = fullPath + ext;
          try {
            if (fs.existsSync(withExt)) {
              const stat = fs.statSync(withExt);
              if (!stat.isDirectory()) {
                return withExt;
              }
            }
          } catch (e) {
            // Ignorer les erreurs
          }
        }
        
        try {
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (!stat.isDirectory()) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignorer les erreurs
        }
      }
      
      // Résoudre @/components vers Components (pas src/components, sauf ui)
      if (id.startsWith('@/components/')) {
        const relPath = id.replace('@/components/', '');
        const fullPath = path.resolve(__dirname, './Components', relPath);
        
        // Essayer avec différentes extensions
        const extensions = ['.jsx', '.js', '.tsx', '.ts', '.json'];
        for (const ext of extensions) {
          const withExt = fullPath + ext;
          try {
            if (fs.existsSync(withExt)) {
              const stat = fs.statSync(withExt);
              if (!stat.isDirectory()) {
                return withExt;
              }
            }
          } catch (e) {
            // Ignorer les erreurs
          }
        }
        
        // Si aucun fichier avec extension n'existe, essayer sans extension
        try {
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (!stat.isDirectory()) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignorer les erreurs
        }
        
        // Retourner null pour laisser Vite gérer l'erreur
        return null;
      }
      
      // Résoudre @/pages vers Pages
      if (id.startsWith('@/pages/')) {
        const relPath = id.replace('@/pages/', '');
        const fullPath = path.resolve(__dirname, './Pages', relPath);
        
        const extensions = ['.jsx', '.js', '.tsx', '.ts', '.json'];
        for (const ext of extensions) {
          const withExt = fullPath + ext;
          try {
            if (fs.existsSync(withExt)) {
              const stat = fs.statSync(withExt);
              if (!stat.isDirectory()) {
                return withExt;
              }
            }
          } catch (e) {
            // Ignorer les erreurs
          }
        }
        
        try {
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (!stat.isDirectory()) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignorer les erreurs
        }
        
        return null;
      }
      
      // Résoudre @/ vers src (pour @/utils, @/api, etc.)
      if (id.startsWith('@/')) {
        const relPath = id.replace('@/', '');
        const fullPath = path.resolve(__dirname, './src', relPath);
        
        // Vérifier si c'est un dossier avec un index.js
        try {
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              // C'est un dossier, chercher index.js/index.jsx
              const indexFiles = ['index.js', 'index.jsx', 'index.ts', 'index.tsx'];
              for (const indexFile of indexFiles) {
                const indexPath = path.join(fullPath, indexFile);
                if (fs.existsSync(indexPath)) {
                  return indexPath;
                }
              }
            }
          }
        } catch (e) {
          // Ignorer les erreurs
        }
        
        // Essayer avec différentes extensions
        const extensions = ['.jsx', '.js', '.tsx', '.ts', '.json'];
        for (const ext of extensions) {
          const withExt = fullPath + ext;
          try {
            if (fs.existsSync(withExt)) {
              const stat = fs.statSync(withExt);
              if (!stat.isDirectory()) {
                return withExt;
              }
            }
          } catch (e) {
            // Ignorer les erreurs
          }
        }
        
        try {
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (!stat.isDirectory()) {
              return fullPath;
            }
          }
        } catch (e) {
          // Ignorer les erreurs
        }
      }
      
      return null;
    }
  };
};

export default defineConfig({
  plugins: [resolveAliases(), react()],
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.ts', '.tsx'],
  },
});

