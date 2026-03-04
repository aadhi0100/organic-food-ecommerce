# Deploy to Your Vercel URL

## Your Vercel URL
```
https://organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app
```

## Quick Deploy (1 Minute)

### Option 1: One Command
```bash
cd organic-food-app
vercel --prod --yes
```

### Option 2: Use Script
```bash
# Double-click: DEPLOY.bat
```

## Setup Environment Variables

Go to: https://vercel.com/aadhityaezhumalai-5234s-projects/organic-food-app/settings/environment-variables

Add these:

```env
NEXTAUTH_SECRET=generate-random-32-chars
NEXTAUTH_URL=https://organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app
JWT_SECRET=generate-random-32-chars
```

### Generate Secrets (PowerShell)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Deploy Now

```bash
cd d:\ecommerce\organic-food-app
vercel --prod
```

## Check Status

- Dashboard: https://vercel.com/aadhityaezhumalai-5234s-projects/organic-food-app
- Live Site: https://organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app

## Auto-Deploy Setup

Every push to GitHub will auto-deploy:

```bash
git add .
git commit -m "Update"
git push
```

Done! ✅
