# 🎁 Liste Cadeau (Gift List)

Application web de gestion de listes de cadeaux avec réservation et cagnotte.

## ✨ Fonctionnalités

- **Listes de cadeaux** : Créez et gérez plusieurs listes (Noël, Anniversaire, etc.)
- **Réservation** : Les invités peuvent réserver des cadeaux sans que l'enfant/destinataire le sache
- **Cagnotte** : Participez à plusieurs pour un gros cadeau
- **Notifications Email** : Recevez un email quand un cadeau est réservé
- **Personnalisation** : Couleur de bannière, icône et emojis personnalisables
- **Scraping intelligent** : Auto-remplissage depuis Amazon, Cdiscount, FNAC, etc.

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Base de données** : Turso (SQLite edge)
- **ORM** : Drizzle
- **Stockage images** : Vercel Blob
- **Emails** : Resend

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/Awhz/GiftList.git
cd GiftList

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Pousser le schéma DB
npx drizzle-kit push

# Lancer en développement
npm run dev
```

## ⚙️ Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | URL de la base Turso |
| `TURSO_AUTH_TOKEN` | Token d'authentification Turso |
| `ADMIN_USERNAME` | Nom d'utilisateur admin |
| `ADMIN_PASSWORD` | Mot de passe admin |
| `RESEND_API_KEY` | Clé API Resend (emails) |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (images) |

## 📦 Déploiement Vercel

1. Importez le repo sur [Vercel](https://vercel.com)
2. Ajoutez les variables d'environnement
3. Pour Vercel Blob : **Storage > Create > Blob** (auto-configure le token)
4. Déployez !

## 📝 Licence

MIT
