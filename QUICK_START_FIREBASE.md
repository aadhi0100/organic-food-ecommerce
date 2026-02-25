# 🚀 Quick Start Guide

## 📱 Run as Desktop/Mobile App

### Desktop App (Easiest - 30 seconds!)

1. **Start the app:**
   - Double-click: `run-app.bat`
   - Wait for browser to open at `http://localhost:3000`

2. **Create desktop shortcut:**
   - In Chrome/Edge, click **⋮** (three dots)
   - Click **"More tools"** → **"Create shortcut"**
   - Check ✅ **"Open as window"**
   - Click **"Create"**

3. **Done!** 🎉
   - App icon appears on desktop
   - Opens like a native Windows app
   - No browser UI visible

### Mobile App (PWA)

**After deploying online:**

**Android:**
- Open in Chrome → Tap ⋮ → "Add to Home screen"

**iPhone:**
- Open in Safari → Tap Share (□↑) → "Add to Home Screen"

---

## 🔥 Firebase Setup (5 minutes)

### Quick Setup:

1. **Run setup helper:**
   ```bash
   setup-firebase.bat
   ```

2. **Or manually:**
   - Go to: https://console.firebase.google.com/
   - Create project: `organic-food-ecommerce`
   - Register web app
   - Copy Firebase config
   - Paste in `.env.local`

3. **Enable services:**
   - ✅ Firestore Database
   - ✅ Authentication (Email/Password)
   - ✅ Storage

4. **Restart app:**
   ```bash
   npm run dev
   ```

**Detailed guide:** See `FIREBASE_SETUP.md`

---

## 🌐 Deploy Online (Access from Anywhere)

### Option 1: Vercel (Recommended - Free)

```bash
npm install -g vercel
vercel
```

Your app is live at: `https://your-app.vercel.app`

### Option 2: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Live at: `https://your-project.firebaseapp.com`

---

## 📚 Documentation

- **FIREBASE_SETUP.md** - Complete Firebase configuration
- **RUN_AS_APP.md** - Desktop/Mobile app guide
- **GITHUB_SETUP.md** - GitHub integration
- **README.md** - Full documentation

---

## 🎮 Test Accounts

- **Admin:** admin@organic.com / admin123
- **Vendor:** vendor@organic.com / vendor123
- **Customer:** customer@organic.com / customer123

---

## ✨ Features

✅ 60 organic products with whole number prices (₹)
✅ GST/CGST calculation (18% total)
✅ Delivery options (₹40/₹60/₹100)
✅ Admin/Vendor/Customer dashboards
✅ Cart with loyalty rewards
✅ Order management
✅ Firebase integration ready
✅ PWA support (works offline)
✅ Mobile responsive

---

## 🆘 Need Help?

1. **Firebase issues:** Read `FIREBASE_SETUP.md`
2. **App installation:** Read `RUN_AS_APP.md`
3. **GitHub sync:** Read `GITHUB_SETUP.md`

---

**Happy Coding! 💚**
