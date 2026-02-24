# ORGANIC FOOD E-COMMERCE - COMPLETE GUIDE

## 🚀 QUICK START

```bash
cd d:\ecommerce\organic-food-app
npm install
npm run dev
```

Access: **http://localhost:3000**

## 🔐 TEST ACCOUNTS

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@organic.com | admin123 |
| Vendor | vendor@organic.com | vendor123 |
| Customer | customer@organic.com | customer123 |

## 💰 INDIAN RUPEES (₹)

### Where to See ₹ Symbol

1. **Customer Dashboard** (`/dashboard/customer`)
   - Total Spent: ₹50,000.00
   - Total Carts: Shows cart count
   - Avg Order Value: ₹5,234.56

2. **Cart Page** (`/cart`)
   - Product prices: ₹499.00
   - Subtotal: ₹2,345.67
   - Final Total: ₹2,111.11

3. **Products** (`/products`)
   - Each product: ₹299.00

4. **All Dashboards**
   - Admin: ₹10,00,000.00
   - Vendor: ₹1,23,456.78

### Loyalty Tiers (Indian Pricing)
- 🥉 Bronze: ₹5,000+ (5% OFF)
- 🥈 Silver: ₹15,000+ (10% OFF)
- 🏆 Gold: ₹30,000+ (15% OFF)
- 💎 Platinum: ₹50,000+ (20% OFF)

## 📂 DATABASE STORAGE LOCATIONS

### Local File Storage
**Location**: `d:\ecommerce\organic-food-app\data\`

```
data/
├── users/                          # USER DATA
│   ├── admin_1.txt                 # Admin profiles
│   ├── vendor_2.txt                # Vendor profiles
│   └── customer_3.txt              # Customer profiles
│
├── carts/                          # CART DATA
│   ├── cart_userId.txt             # Individual carts
│   └── cart_3_export.csv           # Cart exports
│
├── orders/                         # ORDER DATA
│   ├── order_1.txt                 # Order details
│   ├── order_2.txt                 # All orders in ₹
│   └── order_N.txt
│
├── products/                       # PRODUCT DATA
│   └── products_catalog.txt        # 60 products in ₹
│
├── subscriptions/                  # EMAIL SUBSCRIPTIONS ⭐
│   ├── subscription_timestamp.txt  # Individual
│   └── all_subscriptions.txt       # Master list
│
├── exports/                        # EXCEL EXPORTS
│   ├── database_export.xlsx        # Full export
│   ├── users_export.csv
│   ├── orders_export.csv
│   └── products_export.csv
│
├── backups/                        # BACKUPS
│   └── backup_YYYY-MM-DD.json
│
└── logs/                           # ACTIVITY LOGS
    └── activity_log.txt
```

### Firebase Storage (Cloud)
- **Firestore Collections**: users, products, orders, shops, subscriptions
- **Authentication**: Firebase Auth
- **Storage**: Cloud Storage for files

### Browser Storage
- **localStorage**: `user`, `cart`
- **Cookies**: `userRole` (for authentication)

## 📧 SUBSCRIPTION SYSTEM

### How It Works
1. User enters email in footer
2. Stored in: `data/subscriptions/`
3. Admin notified: admin@organic.com
4. Files created:
   - `subscription_timestamp.txt`
   - `all_subscriptions.txt` (master list)

### API Endpoint
```
POST /api/subscribe
Body: { "email": "user@example.com" }
```

## 👥 USER FEATURES

### ADMIN (`/dashboard/admin`)
- ✅ Vendor management (add/delete)
- ✅ Revenue analytics with charts
- ✅ Vendor performance tracking
- ✅ Order management
- ✅ Platform statistics in ₹

**Vendor Management** (`/dashboard/admin/vendors`)
- Add new vendors with Indian phone (+91)
- Delete vendors
- View vendor details
- Search and filter
- Performance metrics

### VENDOR (`/dashboard/vendor`)
- ✅ Add/Edit/Delete products
- ✅ Stock management
- ✅ Low stock alerts (< 20 units)
- ✅ Inventory tracking
- ✅ Revenue in ₹

**Profile** (`/dashboard/vendor/profile`)
- Business information
- Shop overview
- Performance metrics
- Contact management (+91 format)

### CUSTOMER (`/dashboard/customer`)
- ✅ Loyalty rewards system
- ✅ Cart history with count
- ✅ Spending analytics in ₹
- ✅ Discount tiers
- ✅ Order history

**Profile** (`/dashboard/customer/profile`)
- Personal information
- Payment history in ₹
- Loyalty tier status
- Address management

## 🎨 UI/UX FEATURES

### Home Page (`/`)
- Full-screen hero with image
- Interactive feature cards
- Hover effects (scale 1.1x)
- Smooth animations
- Gradient backgrounds

### Interactive Elements
- **Card Hover**: Scale + shadow
- **Button Hover**: Scale 1.05x
- **Border Highlights**: Green on active
- **Smooth Transitions**: 300ms

### Animations
- Fade-in effects
- Slide-up animations
- Color transitions
- Loading states

## 🔥 FIREBASE INTEGRATION

### Setup (Using VS Code Extension)
1. Press `Ctrl+Shift+P`
2. Search "Firebase: Login"
3. Select your project
4. Copy config to `.env.local`

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
JWT_SECRET=your_secret_key
```

### Files
- `src/lib/firebase.ts` - Configuration
- `src/lib/firebaseService.ts` - CRUD operations
- `src/lib/excelFirebaseSync.ts` - Excel sync

## 📊 EXCEL INTEGRATION

### Export Data
```javascript
import { ExcelFirebaseSync } from '@/lib/excelFirebaseSync'
await ExcelFirebaseSync.exportToExcel()
// Creates: data/exports/database_export.xlsx
```

### Import Data
```javascript
await ExcelFirebaseSync.importFromExcel('path/to/file.xlsx')
```

## 📱 MOBILE APP READY

- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized layouts
- ✅ PWA compatible
- ✅ Works on Android/iOS

## 🇮🇳 INDIAN FORMAT

### Currency
- Symbol: ₹ (Indian Rupee)
- Format: ₹1,23,456.78
- Utility: `src/utils/indianFormat.ts`

### Phone Numbers
- Format: +91 12345 67890
- Auto-formatting for Indian numbers

### Locations
- All addresses formatted for India
- Cities: Mumbai, Delhi, Bangalore, etc.

## 🛠️ TECHNICAL DETAILS

### Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase
- Excel (XLSX)

### Key Files
```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── login/page.tsx              # Enhanced login
│   ├── cart/page.tsx               # Cart with history
│   ├── dashboard/
│   │   ├── admin/                  # Admin dashboard
│   │   ├── vendor/                 # Vendor dashboard
│   │   └── customer/               # Customer dashboard
│   └── api/
│       ├── products/               # Product API
│       ├── subscribe/              # Subscription API
│       └── admin/vendors/          # Vendor management
├── lib/
│   ├── firebase.ts                 # Firebase config
│   ├── firebaseService.ts          # Database ops
│   ├── fileStorage.ts              # File storage
│   └── excelFirebaseSync.ts        # Excel sync
├── utils/
│   └── indianFormat.ts             # ₹ formatting
└── components/
    ├── Header.tsx                  # Navigation
    ├── Footer.tsx                  # With subscription
    └── SubscribeForm.tsx           # Email capture
```

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
npx kill-port 3000
npm run dev
```

### Build Errors
```bash
rmdir /s /q .next
npm run build
npm run dev
```

### Login Issues
1. Clear browser cookies
2. Clear localStorage
3. Login again
4. Cookie will be set automatically

### Missing Dependencies
```bash
npm install firebase xlsx
```

## 📈 FEATURES SUMMARY

### ✅ Implemented
- [x] Indian Rupees (₹) everywhere
- [x] Cart count display
- [x] Subscription storage
- [x] Admin vendor management
- [x] Enhanced UI with animations
- [x] Firebase integration
- [x] Excel export/import
- [x] File-based storage
- [x] Mobile responsive
- [x] Role-based access
- [x] Loyalty rewards
- [x] Interactive hover effects

### 📊 Statistics
- **60 Products** across 9 categories
- **5 User Roles** (Admin, Vendor, Customer)
- **4 Loyalty Tiers** with discounts
- **Multiple Shops** per vendor
- **Complete Analytics** dashboards

## 🎯 QUICK ACTIONS

### View Subscriptions
```
File: data/subscriptions/all_subscriptions.txt
```

### View Orders
```
File: data/orders/order_1.txt
```

### View Products
```
File: data/products/products_catalog.txt
```

### Export to Excel
```bash
npm run export:excel
```

## 📞 SUPPORT

For issues:
1. Check this guide
2. Verify Node.js >= 18.0.0
3. Check console for errors
4. Ensure all dependencies installed

## 🎉 SUCCESS CHECKLIST

- [ ] Dependencies installed
- [ ] Data directories created
- [ ] Application runs without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with test accounts
- [ ] See ₹ symbol in prices
- [ ] Cart count displays
- [ ] Subscription works
- [ ] Data files created in `data/` folder
- [ ] Different dashboards for each role

---

**Ready to use!** Start with: `npm run dev`
