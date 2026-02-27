# 🌿 ORGANIC FOOD E-COMMERCE - COMPLETE GUIDE

## 🚀 QUICK START

### Run the App
```bash
npm run dev
```
Or double-click: **RUN.bat**

Visit: **http://localhost:3000**

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@organic.com | admin123 |
| Vendor | vendor@organic.com | vendor123 |
| Customer | customer@organic.com | customer123 |

---

## ✅ FEATURES

### Implemented
- ✅ Dark Mode (Moon/Sun toggle in header)
- ✅ Real-Time Notifications (Test buttons on homepage)
- ✅ Advanced Search (Products page filters)
- ✅ PWA Support (Install as app)
- ✅ Wishlist (Heart icon on products)
- ✅ Social Sharing
- ✅ Smooth Animations
- ✅ Skeleton Loaders

### Test Features
1. **Dark Mode**: Click Moon/Sun icon in header
2. **Notifications**: Test buttons on homepage (bottom-left)
3. **Search**: Products page → Click filter icon
4. **Wishlist**: Click heart on any product
5. **PWA**: Install via browser icon

---

## 📱 DEPLOYMENT

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Why Vercel?
- Made by Next.js creators
- Supports all features
- API routes work
- Free tier

### Firebase Issue
Firebase needs static HTML, but Next.js uses server-side rendering.
Use Vercel instead.

---

## 🔧 TROUBLESHOOTING

### Port 3000 busy
```bash
npx kill-port 3000
```

### Module errors
```bash
npm install
```

### Build fails
```bash
rmdir /s /q .next
npm run build
```

---

## 📊 TECH STACK

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand + Context API
- **Database**: Local files + Firebase ready

---

## 🔗 GIT/GITHUB

### Initialize
```bash
git init
git add .
git commit -m "Initial commit"
```

### Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git branch -M main
git push -u origin main
```

### Quick Push
Double-click: **quick-push.bat**

---

## 📁 PROJECT STRUCTURE

```
src/
├── app/              # Pages
├── components/       # UI components
├── context/          # State management
├── hooks/            # Custom hooks
├── lib/              # Utilities
└── types/            # TypeScript types

public/
├── sw.js            # Service worker
└── manifest.json    # PWA manifest
```

---

## 🎯 SCRIPTS

- `npm run dev` - Start development
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

---

**That's it! Everything you need in one file.** 🚀
