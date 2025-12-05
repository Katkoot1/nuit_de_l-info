#!/bin/bash

# Script pour préparer le projet pour GitHub

echo "🚀 Préparation du projet pour GitHub..."
echo ""

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez-le depuis https://git-scm.com"
    exit 1
fi

# Vérifier si déjà un dépôt Git
if [ -d ".git" ]; then
    echo "⚠️  Un dépôt Git existe déjà."
    read -p "Voulez-vous continuer ? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
else
    # Initialiser Git
    echo "📦 Initialisation de Git..."
    git init
fi

# Ajouter tous les fichiers
echo "➕ Ajout des fichiers..."
git add .

# Faire le commit
echo "💾 Création du commit initial..."
git commit -m "Initial commit - NIRD Quest project"

echo ""
echo "✅ Projet préparé pour GitHub !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Créez un nouveau dépôt sur https://github.com"
echo "2. Copiez l'URL du dépôt (ex: https://github.com/VOTRE-USERNAME/nird-quest.git)"
echo "3. Exécutez ces commandes :"
echo ""
echo "   git remote add origin https://github.com/VOTRE-USERNAME/nird-quest.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Mettez à jour RENDU.md avec le lien : https://github.com/VOTRE-USERNAME/nird-quest"
echo ""

