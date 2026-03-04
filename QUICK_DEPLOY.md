# Quick Deploy to Vercel - 2 Minutes

## AUTOMATIC DEPLOYMENT (Recommended)

### Just Double-Click: `DEPLOY_NOW.bat`

That's it! The script will:
- Install GitHub CLI (if needed)
- Create GitHub repository
- Upload all files
- Open Vercel for you

Then in Vercel:
1. Click "Import" on your repository
2. Click "Deploy"

---

## MANUAL DEPLOYMENT (Alternative)

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Vercel (1 min)
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy"

## Step 3: Add Environment Variables (After Deploy)
In Vercel Dashboard → Settings → Environment Variables, add:

### Minimum Required
```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
JWT_SECRET=your-jwt-secret
```

### Generate Secrets
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use: https://generate-secret.vercel.app/32
```

## Step 4: Redeploy
Click "Redeploy" in Vercel dashboard after adding variables.

## Done! 🎉
Your app is live at: https://your-app.vercel.app

---

## Next Steps (Optional)

### Add Firebase (for production data)
See `.env.vercel` for Firebase variables

### Add Stripe (for payments)
Get keys from https://dashboard.stripe.com/apikeys

### Custom Domain
Vercel Dashboard → Domains → Add Domain

---

## Troubleshooting

**Build fails?**
- Run `npm run build` locally first
- Check error logs in Vercel dashboard

**App loads but features broken?**
- Add missing environment variables
- Check Firebase configuration

**Need help?**
See `VERCEL_DEPLOYMENT.md` for detailed guide
