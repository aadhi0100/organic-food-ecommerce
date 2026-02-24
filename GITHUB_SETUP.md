# 🚀 GitHub Setup Guide

## Step 1: Initialize Git (First Time Only)

Open Command Prompt in `d:\ecommerce\organic-food-app` and run:

```bash
git init
git add .
git commit -m "Initial commit: Organic Food E-commerce App"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New Repository"** (+ icon, top right)
3. Name it: `organic-food-ecommerce`
4. Keep it **Private** (recommended for sensitive data)
5. **DON'T** initialize with README (we already have one)
6. Click **"Create Repository"**

## Step 3: Connect to GitHub

Copy your repository URL from GitHub, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/organic-food-ecommerce.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Auto-Sync Every Change

### Option A: Manual Push (Recommended)
After making changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

### Option B: Use Quick Push Script
Just run: `quick-push.bat`

It will automatically:
- Add all changes
- Commit with timestamp
- Push to GitHub

## 🔐 Important Security Notes

✅ **Protected by .gitignore:**
- User data (`/data/users/`)
- Orders (`/data/orders/`)
- Carts (`/data/carts/`)
- Environment variables (`.env.local`)
- Sensitive credentials

❌ **Never commit:**
- Real user emails/passwords
- API keys
- Firebase credentials
- Payment information

## 📝 Git Commands Cheat Sheet

```bash
# Check status
git status

# Add specific files
git add src/app/page.tsx

# Add all changes
git add .

# Commit with message
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

## 🔄 Workflow Example

```bash
# 1. Make changes to your code
# 2. Check what changed
git status

# 3. Add changes
git add .

# 4. Commit with meaningful message
git commit -m "Added new product category feature"

# 5. Push to GitHub
git push
```

## 🆘 Troubleshooting

### "Permission denied"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/organic-food-ecommerce.git
```

### "Repository not found"
- Check repository name spelling
- Verify you're logged into correct GitHub account
- Ensure repository exists on GitHub

### "Failed to push"
```bash
# Pull first, then push
git pull origin main --rebase
git push
```

### First time Git setup
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## ✅ Success Checklist

- [ ] Git initialized
- [ ] GitHub repository created
- [ ] Remote origin added
- [ ] First push successful
- [ ] `.gitignore` working (sensitive files excluded)
- [ ] Can see code on GitHub

---

**Need help?** Check [GitHub Docs](https://docs.github.com/en/get-started)
