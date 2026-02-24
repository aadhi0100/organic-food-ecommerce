# ⚡ QUICK START GUIDE

## 🎯 First Time Setup (Do Once)

1. **Double-click**: `setup-first-time.bat`
   - Installs dependencies
   - Creates folders
   - Initializes Git

2. **Connect to GitHub**:
   - Follow instructions in `GITHUB_SETUP.md`
   - Takes 5 minutes

## 🚀 Daily Usage

### Run the App
**Double-click**: `run-app.bat`
- Opens at: http://localhost:3000
- Press `Ctrl+C` to stop

### Push Changes to GitHub
**Double-click**: `quick-push.bat`
- Automatically commits and pushes
- Or use manual Git commands

## 📁 Important Files

| File | Purpose |
|------|---------|
| `run-app.bat` | Start the app |
| `quick-push.bat` | Push to GitHub |
| `setup-first-time.bat` | Initial setup |
| `GITHUB_SETUP.md` | GitHub instructions |
| `README.md` | Full documentation |

## 🔄 Typical Workflow

```
1. Double-click run-app.bat
2. Make changes to code
3. Test in browser (localhost:3000)
4. Double-click quick-push.bat
5. Changes are on GitHub! ✓
```

## 🎮 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@organic.com | admin123 |
| Vendor | vendor@organic.com | vendor123 |
| Customer | customer@organic.com | customer123 |

## 🆘 Problems?

### App won't start
```bash
npm install
npm run dev
```

### Port 3000 busy
```bash
npx kill-port 3000
```

### Git issues
- Read `GITHUB_SETUP.md`
- Check you're logged into GitHub

## ✅ Success Checklist

- [ ] Ran `setup-first-time.bat`
- [ ] Connected to GitHub
- [ ] App runs with `run-app.bat`
- [ ] Can push with `quick-push.bat`
- [ ] Can login at localhost:3000

---

**That's it!** You're ready to code and collaborate! 🎉
