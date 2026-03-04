# 🌿 Organic Food E-Commerce - Complete Guide

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit: **http://localhost:3000**

Or double-click: **RUN.bat**

## 🎮 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@organic.com | admin123 |
| Vendor | vendor@organic.com | vendor123 |
| Customer | customer@organic.com | customer123 |

## ✅ Features

- Multi-role support (Customer, Vendor, Admin)
- Dark mode with theme persistence
- Real-time notifications
- Advanced search & filters
- PWA support (installable app)
- Wishlist with animations
- Social sharing
- Multi-language support (English, Hindi, Tamil)
- Indian payment methods (UPI, Paytm, etc.)
- Order tracking & invoices
- Vendor analytics dashboard
- Admin data export (PDF, Excel)
- Festival offer banners
- Offline support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2+
- **Styling**: Tailwind CSS 3.3.5
- **Animations**: Framer Motion 10.16.4
- **State**: Zustand + React Context
- **Auth**: NextAuth.js 4.24.5
- **Database**: File-based JSON + Firebase ready
- **Payments**: Stripe 14.5.0
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
src/
├── app/              # Next.js pages & API routes
├── components/       # React components
├── context/          # Global state (auth, theme, notifications)
├── hooks/            # Custom hooks (useCart, useWishlist)
├── lib/              # Business logic
├── services/         # External integrations
├── types/            # TypeScript types
└── utils/            # Helper functions

data/                 # File-based storage
├── users/, products/, orders/, carts/
├── logs/, exports/, backups/

public/               # Static assets
├── images/, icons/, videos/
├── manifest.json     # PWA manifest
└── sw.js            # Service worker
```

## 🎯 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
npm test             # Run tests
npm run analyze      # Bundle analysis
```

## 📱 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

Or use: **deploy-vercel.bat**

### Environment Variables
Create `.env.local`:
```
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
```

## 🔧 Troubleshooting

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

### Clear cache
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 🔗 Git Commands

### Initialize
```bash
git init
git add .
git commit -m "Initial commit"
```

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git branch -M main
git push -u origin main
```

Or use: **quick-push.bat** or **github-update.bat**

## 🧪 Testing Features

1. **Dark Mode**: Click moon/sun icon in header
2. **Notifications**: Test buttons on homepage
3. **Search**: Products page → filter icon
4. **Wishlist**: Click heart on products
5. **PWA**: Install via browser prompt
6. **Multi-language**: Language selector in header
7. **Cart**: Add products and checkout
8. **Order Tracking**: Place order and track status

## 📊 Role-Specific Features

### Customer
- Browse products with filters
- Add to cart & wishlist
- Checkout with multiple payment options
- Track orders with real-time updates
- Download invoices
- Manage profile

### Vendor
- Add/edit/delete products
- Manage inventory
- View order analytics
- Track sales performance
- Export reports

### Admin
- User management
- Product oversight
- Order management
- Data export (PDF, Excel)
- System logs
- Analytics dashboard

## 🌐 Indian Localization

- Currency: ₹ (Indian Rupee)
- Date format: DD/MM/YYYY
- Payment methods: UPI, Paytm, PhonePe, Google Pay
- Languages: English, Hindi, Tamil
- Festival offers: Diwali, Holi, Pongal
- Regional preferences

## 🔒 Security

- Password hashing with bcryptjs
- JWT tokens in httpOnly cookies
- Server-side validation
- Protected API routes
- Role-based access control
- Environment variable protection

## 📦 Key Dependencies

- next: 14.0.0
- react: 18.2.0
- typescript: 5.2.0
- tailwindcss: 3.3.5
- framer-motion: 10.16.4
- zustand: 4.4.6
- next-auth: 4.24.5
- stripe: 14.5.0
- firebase: 12.9.0

## 🎨 Customization

### Colors (tailwind.config.js)
```js
colors: {
  primary: '#10b981',    // Green
  secondary: '#f59e0b',  // Amber
  // Add custom colors
}
```

### Theme (src/context/ThemeContext.tsx)
- Light/dark mode toggle
- Persistent theme storage
- System preference detection

## 📝 Development Guidelines

- Use TypeScript strict mode
- Follow ESLint rules
- Use path aliases (@/)
- Server Components by default
- Client Components with 'use client'
- Tailwind for styling
- Framer Motion for animations

## 🚀 Performance

- Image optimization with next/image
- Font optimization with next/font
- Code splitting with dynamic imports
- LocalStorage for cart persistence
- Service worker for offline support
- Bundle size monitoring

## 📄 License

MIT License - See LICENSE file

---

**Made with 💚 for organic food lovers**

For detailed architecture and standards, see `.amazonq/rules/memory-bank/`
