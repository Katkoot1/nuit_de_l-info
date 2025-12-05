# Guide : Fournir le Lien vers les Sources

## 🎯 Option 1 : GitHub (Recommandé - Gratuit et Professionnel)

### Étape 1 : Créer un compte GitHub (si vous n'en avez pas)
1. Aller sur https://github.com
2. Cliquer sur "Sign up"
3. Créer un compte (gratuit)

### Étape 2 : Créer un nouveau dépôt sur GitHub
1. Se connecter à GitHub
2. Cliquer sur le bouton "+" en haut à droite
3. Cliquer sur "New repository"
4. Remplir :
   - **Repository name** : `nird-quest` (ou un autre nom)
   - **Description** : "NIRD Quest - Simulation stratégique du numérique responsable"
   - **Visibilité** : Public (recommandé) ou Private
   - **NE PAS** cocher "Initialize with README" (on a déjà un README)
5. Cliquer sur "Create repository"

### Étape 3 : Initialiser Git dans votre projet

Ouvrir un terminal dans le dossier du projet et exécuter :

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Faire le premier commit
git commit -m "Initial commit - NIRD Quest project"

# 4. Ajouter le dépôt distant GitHub
git remote add origin https://github.com/VOTRE-USERNAME/nird-quest.git
# ⚠️ Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub

# 5. Pousser le code
git branch -M main
git push -u origin main
```

**Note :** GitHub vous demandera peut-être de vous authentifier. Suivez les instructions à l'écran.

### Étape 4 : Obtenir le lien
Une fois le code poussé, votre dépôt sera accessible à :
```
https://github.com/VOTRE-USERNAME/nird-quest
```

**C'est ce lien que vous mettrez dans `RENDU.md` !**

---

## 🎯 Option 2 : Archive ZIP (Alternative Simple)

Si vous préférez ne pas utiliser Git, vous pouvez créer une archive ZIP.

### Étape 1 : Créer l'archive
1. Dans le Finder (Mac), sélectionner tous les fichiers du projet
2. Clic droit > "Compresser X éléments"
3. Renommer le fichier : `nird-quest-sources.zip`

**⚠️ Important :** Exclure ces dossiers/fichiers :
- `node_modules/` (trop gros, pas nécessaire)
- `dist/` (fichiers de build, pas nécessaire)
- `.git/` (si présent)

### Étape 2 : Mettre en ligne l'archive

**Option A : Google Drive**
1. Aller sur https://drive.google.com
2. Uploader le fichier ZIP
3. Clic droit sur le fichier > "Partager" > "Obtenir le lien"
4. Mettre le lien en "Toute personne disposant du lien"
5. Copier le lien

**Option B : Dropbox**
1. Aller sur https://dropbox.com
2. Uploader le fichier ZIP
3. Clic droit > "Partager" > "Créer un lien"
4. Copier le lien

**Option C : WeTransfer**
1. Aller sur https://wetransfer.com
2. Uploader le fichier ZIP
3. Obtenir le lien de téléchargement
4. ⚠️ Note : Le lien expire après 7 jours

### Étape 3 : Mettre le lien dans RENDU.md
Dans `RENDU.md`, ligne 20, remplacer :
```
**Lien de téléchargement des sources :** [À compléter - lien vers dépôt Git ou archive]
```
par :
```
**Lien de téléchargement des sources :** https://votre-lien.com/nird-quest-sources.zip
```

---

## 📝 Mise à jour de RENDU.md

Une fois que vous avez le lien (GitHub ou ZIP), mettez à jour `RENDU.md` :

```markdown
## 📦 Sources du Projet

**Lien de téléchargement des sources :** https://github.com/VOTRE-USERNAME/nird-quest
```

ou

```markdown
## 📦 Sources du Projet

**Lien de téléchargement des sources :** https://drive.google.com/file/d/XXXXX/view?usp=sharing
```

---

## ✅ Checklist

- [ ] Compte GitHub créé (ou archive ZIP préparée)
- [ ] Dépôt créé sur GitHub (ou archive uploadée)
- [ ] Code poussé sur GitHub (ou lien de téléchargement obtenu)
- [ ] Lien copié
- [ ] Lien ajouté dans `RENDU.md` à la ligne 20

---

## 🆘 Aide Supplémentaire

### Si Git n'est pas installé
```bash
# Sur Mac, installer via Homebrew
brew install git

# Ou télécharger depuis https://git-scm.com
```

### Si vous avez des erreurs Git
- Vérifier que vous êtes dans le bon dossier
- Vérifier que le dépôt GitHub existe bien
- Vérifier l'URL du dépôt distant

### Commandes Git utiles
```bash
# Vérifier le statut
git status

# Voir les remotes configurés
git remote -v

# Changer l'URL du remote
git remote set-url origin https://github.com/VOTRE-USERNAME/nird-quest.git
```

---

**Recommandation :** Utilisez GitHub (Option 1) car c'est plus professionnel, permanent, et permet aux correcteurs de voir l'historique du projet.

