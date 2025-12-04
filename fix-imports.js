import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour ajouter .jsx aux imports
function addExtensionsToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Pattern pour trouver les imports sans extension (amélioré)
  const importPattern = /from\s+['"]@\/(components|pages)\/([^'"]+?)(?<!\.(jsx?|tsx?|json))['"]/g;
  
  content = content.replace(importPattern, (match, type, importPath) => {
    // Ignorer si l'import a déjà une extension
    if (/\.(jsx?|tsx?|json)$/.test(importPath)) {
      return match;
    }
    
    // Vérifier si le fichier existe avec .jsx
    const baseDir = type === 'components' ? './Components' : './Pages';
    const fullPath = path.resolve(__dirname, baseDir, importPath);
    const withJsx = fullPath + '.jsx';
    
    if (fs.existsSync(withJsx)) {
      modified = true;
      return match.replace(`@/${type}/${importPath}`, `@/${type}/${importPath}.jsx`);
    }
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed imports in: ${filePath}`);
    return true;
  }
  return false;
}

// Trouver tous les fichiers .jsx dans Pages, Components et Layout.jsx
const filesToFix = [];

// Pages
const pagesDir = path.resolve(__dirname, './Pages');
if (fs.existsSync(pagesDir)) {
  const pages = fs.readdirSync(pagesDir);
  pages.forEach(file => {
    if (file.endsWith('.jsx')) {
      filesToFix.push(path.join(pagesDir, file));
    }
  });
}

// Components (récursif)
function findJsxFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findJsxFiles(filePath);
    } else if (file.endsWith('.jsx')) {
      filesToFix.push(filePath);
    }
  });
}

const componentsDir = path.resolve(__dirname, './Components');
if (fs.existsSync(componentsDir)) {
  findJsxFiles(componentsDir);
}

// src directory
const srcDir = path.resolve(__dirname, './src');
if (fs.existsSync(srcDir)) {
  findJsxFiles(srcDir);
}

// Layout.jsx
const layoutFile = path.resolve(__dirname, './Layout.jsx');
if (fs.existsSync(layoutFile)) {
  filesToFix.push(layoutFile);
}

// Fixer tous les fichiers
let fixedCount = 0;
filesToFix.forEach(file => {
  if (addExtensionsToFile(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} out of ${filesToFix.length} files.`);

