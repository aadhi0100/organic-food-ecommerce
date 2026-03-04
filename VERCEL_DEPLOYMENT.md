# Vercel Deployment Guide

## Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier works)
- Firebase project setup
- Stripe account (for payments)

## Step 1: Prepare Repository

### Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### Push to GitHub
```bash
# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Web Interface (Recommended)
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings
5. Click "Deploy"

### Option B: CLI
```bash
npm i -g vercel
vercel login
vercel
```

## Step 3: Configure Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all variables from `.env.vercel` file:

### Required Variables
```
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.vercel.app
JWT_SECRET=<generate-with: openssl rand -base64 32>
```

### Stripe (Required for payments)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Firebase (Required for data storage)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Email (Optional)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Step 4: Setup Firebase

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project
3. Enable Firestore Database
4. Enable Storage
5. Enable Authentication (Email/Password)

### Firestore Collections
Create these collections:
- `users`
- `products`
- `orders`
- `carts`

### Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    match /carts/{cartId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Migrate Data to Firebase

Since file-based storage doesn't work on Vercel, migrate existing data:

```bash
# Run migration script (create if needed)
node scripts/migrate-to-firebase.js
```

## Step 6: Redeploy

After adding environment variables:
```bash
git add .
git commit -m "Add Vercel configuration"
git push
```

Vercel auto-deploys on push.

## Step 7: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Verification Checklist

- [ ] App builds successfully
- [ ] Environment variables set
- [ ] Firebase connected
- [ ] Authentication works
- [ ] Products load
- [ ] Cart functions
- [ ] Checkout works
- [ ] Orders save to Firebase

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Run `npm run build` locally first

### Environment Variables Not Working
- Ensure variables are set for "Production" environment
- Redeploy after adding variables
- Check variable names match exactly

### Firebase Connection Issues
- Verify Firebase config in environment variables
- Check Firebase project is active
- Verify security rules allow access

### File Storage Issues
- Migrate all file operations to Firebase Storage
- Update file paths to use Firebase URLs

## Monitoring

- View logs: Vercel Dashboard → Your Project → Deployments → View Function Logs
- Analytics: Vercel Dashboard → Your Project → Analytics
- Performance: Use Vercel Speed Insights

## Automatic Deployments

Every push to `main` branch triggers automatic deployment.

For preview deployments, push to other branches.

## Rollback

If deployment fails:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Support

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
