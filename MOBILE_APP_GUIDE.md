# 📱 Mobile App & Deployment Guide

## Overview
This Organic Food E-Commerce application works as both a **website** and a **mobile app** (PWA - Progressive Web App).

---

## 🌐 Website Access

### Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start

# Access at
http://localhost:3000
```

---

## 📱 Mobile App (PWA)

### What is a PWA?
A Progressive Web App works like a native mobile app but runs in a web browser. Users can:
- Install it on their phone home screen
- Use it offline
- Receive push notifications
- Get app-like experience

### How to Install on Mobile

#### Android (Chrome/Edge)
1. Open `https://your-domain.com` in Chrome
2. Tap the menu (⋮) in top-right
3. Select "Add to Home screen" or "Install app"
4. Tap "Install" or "Add"
5. App icon appears on home screen

#### iOS (Safari)
1. Open `https://your-domain.com` in Safari
2. Tap the Share button (□↑)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen

### Features Available in Mobile App
✅ Full e-commerce functionality
✅ Shopping cart
✅ User authentication
✅ Order placement
✅ Product browsing
✅ Offline product viewing (cached)
✅ Push notifications (when enabled)
✅ Native-like navigation
✅ Fast loading
✅ Works without app store

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

**Steps:**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Your app is live!

**Your URLs:**
- Website: `https://your-app.vercel.app`
- Mobile App: Same URL (install as PWA)

### Option 2: Netlify (Free)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

### Option 3: AWS Amplify

1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
4. Deploy

### Option 4: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build Docker image
docker build -t organic-food-app .

# Run container
docker run -p 3000:3000 organic-food-app
```

---

## 🔧 Configuration for Production

### Environment Variables

Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

### Update next.config.js

```javascript
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'your-cdn.com'],
    unoptimized: false, // Enable optimization in production
  },
  // Add your domain
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}
```

---

## 📊 Data Storage

### Current Setup (Development)
- **In-Memory Storage**: Data stored in `src/lib/db.ts`
- **LocalStorage**: Cart and user session
- **Resets**: Data resets on server restart

### Production Setup Options

#### Option 1: PostgreSQL (Recommended)
```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Update schema.prisma
# Run migrations
npx prisma migrate dev

# Generate client
npx prisma generate
```

#### Option 2: MongoDB
```bash
npm install mongodb mongoose

# Connect in lib/mongodb.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

mongoose.connect(MONGODB_URI)
```

#### Option 3: Firebase
```bash
npm install firebase

# Initialize Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
```

#### Option 4: Supabase (Free PostgreSQL)
```bash
npm install @supabase/supabase-js

# Initialize
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
```

---

## 🗺️ Google Maps Integration

### Get API Key
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict key to your domain

### Add to Environment
```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_api_key_here
```

### Usage in Code
```typescript
// Already implemented in checkout page
// Shows map for delivery location
```

---

## 📸 Image Management

### Current Setup
- Using Unsplash URLs (free, no API key needed)
- Next.js Image optimization
- Automatic responsive images

### Production Options

#### Option 1: Cloudinary (Free tier)
```bash
npm install cloudinary

# Upload images
import { v2 as cloudinary } from 'cloudinary'
cloudinary.uploader.upload('image.jpg')
```

#### Option 2: AWS S3
```bash
npm install @aws-sdk/client-s3

# Upload to S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
```

#### Option 3: Vercel Blob Storage
```bash
npm install @vercel/blob

# Upload
import { put } from '@vercel/blob'
await put('image.jpg', file, { access: 'public' })
```

---

## 🔐 Authentication Enhancement

### Add OAuth (Google, Facebook)
```bash
npm install next-auth

# Configure providers in pages/api/auth/[...nextauth].ts
```

### Add JWT Tokens
```bash
npm install jsonwebtoken

# Generate tokens for API security
```

---

## 💳 Payment Integration

### Stripe Setup
```bash
npm install stripe @stripe/stripe-js

# Add to .env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### PayPal Setup
```bash
npm install @paypal/react-paypal-js

# Add PayPal button to checkout
```

---

## 📧 Email Notifications

### SendGrid
```bash
npm install @sendgrid/mail

# Send order confirmations
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
```

### Resend (Modern alternative)
```bash
npm install resend

# Send emails
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
```

---

## 📱 Push Notifications

### Web Push API
```javascript
// Request permission
Notification.requestPermission()

// Send notification
new Notification('Order Delivered!', {
  body: 'Your organic food has arrived',
  icon: '/icon-192.png'
})
```

### Firebase Cloud Messaging
```bash
npm install firebase

# Setup FCM for push notifications
```

---

## 🧪 Testing

### Run Tests
```bash
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### E2E Testing
```bash
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

---

## 📈 Analytics

### Google Analytics
```bash
npm install @next/third-parties

# Add to layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

### Vercel Analytics
```bash
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'
<Analytics />
```

---

## 🔍 SEO Optimization

Already implemented:
- ✅ Meta tags
- ✅ Open Graph tags
- ✅ Semantic HTML
- ✅ Image alt texts
- ✅ Sitemap ready

Add:
```bash
# Generate sitemap
npm install next-sitemap

# Create next-sitemap.config.js
```

---

## 🚀 Performance Optimization

### Current Optimizations
- ✅ Next.js Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Caching
- ✅ Compression

### Additional Optimizations
```bash
# Analyze bundle
npm run analyze

# Optimize images
npm install sharp

# Add service worker
npm install next-pwa
```

---

## 📱 App Store Submission (Optional)

### Convert to Native App

#### Using Capacitor
```bash
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Build
npm run build
npx cap sync

# Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

#### Using React Native WebView
```bash
npx react-native init OrganicFoodApp

# Add WebView
npm install react-native-webview
```

---

## 🎯 Quick Start Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Testing
npm test                # Run tests
npm run lint            # Check code quality
npm run type-check      # TypeScript check

# Deployment
vercel                  # Deploy to Vercel
netlify deploy          # Deploy to Netlify
```

---

## 📞 Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs

### Community
- GitHub Issues: Report bugs
- Discord: Join community
- Stack Overflow: Ask questions

---

## ✅ Checklist Before Going Live

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Add payment gateway
- [ ] Set up email service
- [ ] Configure Google Maps API
- [ ] Add analytics
- [ ] Test on mobile devices
- [ ] Test PWA installation
- [ ] Set up SSL certificate
- [ ] Configure domain
- [ ] Add error monitoring (Sentry)
- [ ] Set up backup system
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Test all user flows
- [ ] Optimize images
- [ ] Enable caching
- [ ] Set up CDN

---

## 🎉 Your App is Ready!

The application works as:
1. **Website**: Access via browser on any device
2. **Mobile App**: Install as PWA on phone
3. **Desktop App**: Install as PWA on computer

**Same codebase, multiple platforms!**

For questions or issues, check the main README.md or create an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
