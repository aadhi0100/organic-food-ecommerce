# 🔥 Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `organic-food-ecommerce`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In Firebase Console, click **Web icon** (</>) 
2. App nickname: `Organic Food App`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the Firebase config** (you'll need this!)

## Step 3: Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose location: `asia-south1` (India) or closest to you
5. Click **"Enable"**

## Step 4: Enable Authentication

1. Go to **"Authentication"** → **"Sign-in method"**
2. Enable **"Email/Password"**
3. Click **"Save"**

## Step 5: Enable Storage

1. Go to **"Storage"**
2. Click **"Get started"**
3. Use **test mode** rules
4. Click **"Done"**

## Step 6: Configure Your App

### Update `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

**Replace with your actual Firebase config values!**

## Step 7: Set Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - Read by all, Write by vendors/admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'vendor' || request.auth.token.role == 'admin');
    }
    
    // Orders - Read/Write by owner and admin
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
    }
    
    // Users - Read/Write by owner and admin
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.role == 'admin');
      allow write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.role == 'admin');
    }
    
    // Shops - Read by all, Write by owner/admin
    match /shops/{shopId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (resource.data.owner == request.auth.uid || request.auth.token.role == 'admin');
    }
  }
}
```

## Step 8: Set Storage Security Rules

In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 9: Test Firebase Connection

Run your app:
```bash
npm run dev
```

Open browser console (F12) and check for Firebase initialization messages.

## 🔄 Sync Local Data to Firebase

Your app currently uses local file storage. To migrate to Firebase:

1. **Products**: Already configured in `src/lib/firebaseService.ts`
2. **Users**: Update authentication to use Firebase Auth
3. **Orders**: Automatically sync to Firestore

## 📱 Firebase Features Available

✅ **Firestore Database** - Real-time NoSQL database
✅ **Authentication** - User login/signup
✅ **Storage** - Image uploads
✅ **Hosting** - Deploy your app
✅ **Analytics** - Track user behavior
✅ **Cloud Functions** - Backend logic

## 🚀 Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Hosting
# - Use existing project
# - Public directory: out
# - Single-page app: Yes

# Build your app
npm run build

# Deploy
firebase deploy
```

Your app will be live at: `https://your-project.firebaseapp.com`

## 🔐 Security Best Practices

1. **Never commit** `.env.local` to GitHub
2. Use **environment variables** for all secrets
3. Enable **App Check** for production
4. Set proper **Firestore rules** before going live
5. Use **Firebase Admin SDK** for server-side operations

## 📊 Monitor Your App

- **Firebase Console** → Analytics
- **Firebase Console** → Performance
- **Firebase Console** → Crashlytics

## 🆘 Troubleshooting

### "Firebase not initialized"
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

### "Permission denied"
- Update Firestore security rules
- Check user authentication

### "Quota exceeded"
- Firebase free tier limits:
  - 50K reads/day
  - 20K writes/day
  - 1GB storage

---

**Need help?** Check [Firebase Documentation](https://firebase.google.com/docs)
