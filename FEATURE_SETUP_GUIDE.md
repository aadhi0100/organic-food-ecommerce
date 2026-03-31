# Feature Setup Guide

This guide explains how to enable and test all features: Product Images, Product Names, Invoice Updates, Welcome Emails, and Password Reset Emails.

## 1. Product Images & Names

### Status
✅ **Already Implemented** - All product images and names are configured in the system.

### How It Works
- Product images are stored in `/public/images/products/`
- Product catalog is in `src/lib/productCatalog.ts`
- Product names and details are in `src/lib/allProducts.ts`
- Images are automatically matched to products by name

### To View
1. Go to https://organic-food-app-ashy.vercel.app/products
2. All products display with their images and names
3. Click any product to see details

### To Add New Products
Edit `src/lib/allProducts.ts` and add product entries with:
```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  image: '/images/products/product-name.jpg',
  price: 299,
  // ... other fields
}
```

---

## 2. Invoice System

### Status
✅ **Fully Implemented** - Professional invoices with all details

### Features
- Order summary with itemized breakdown
- Customer & shipping address
- Payment method & warehouse info
- Delivery timeline tracking
- Tax & discount calculations
- Professional PDF-ready design

### To View Invoice
1. Place an order (checkout flow)
2. After order confirmation, go to `/invoice/[orderId]`
3. Or access from dashboard: `/dashboard/customer`

### Invoice Data Includes
- Order ID & tracking number
- Customer details
- All items with prices & discounts
- Shipping address
- Payment method
- Warehouse information
- Delivery timeline

---

## 3. Welcome Email

### Status
⚠️ **Requires Configuration** - Code is ready, needs email setup

### What It Does
- Sends personalized welcome email to new users
- Different templates for new vs. returning users
- Includes product recommendations
- Links to shop, dashboard, and support

### To Enable

#### Step 1: Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to App Passwords (https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password

#### Step 2: Update Environment Variables
Add to `.env.local` (local) or Vercel dashboard (production):

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
APP_BASE_URL=https://organic-food-app-ashy.vercel.app
```

#### Step 3: Test
1. Register a new account
2. Check email inbox for welcome message
3. Verify links work correctly

### Email Templates
- **New User**: Welcome with onboarding info
- **Returning User**: Welcome back with order history links

---

## 4. Password Reset Email

### Status
⚠️ **Requires Configuration** - Code is ready, needs email setup

### What It Does
- Sends password reset link via email
- Link expires after 24 hours
- Secure token-based reset
- Redirects to password change form

### To Enable

#### Step 1: Same as Welcome Email
Use the same Gmail app password setup above

#### Step 2: Update Environment Variables
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
APP_BASE_URL=https://organic-food-app-ashy.vercel.app
```

#### Step 3: Test
1. Go to `/forgot-password`
2. Enter your email
3. Check email for reset link
4. Click link and set new password

### Reset Flow
1. User requests password reset
2. System generates secure token
3. Email sent with reset link
4. User clicks link (valid 24 hours)
5. User enters new password
6. Password updated securely

---

## 5. Vercel Deployment Configuration

### Current Status
✅ App is deployed at: https://organic-food-app-ashy.vercel.app

### To Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select "organic-food-app" project
3. Go to Settings → Environment Variables
4. Add these variables:

```
APP_BASE_URL = https://organic-food-app-ashy.vercel.app
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password
APP_SESSION_SECRET = (already set)
GOOGLE_CLIENT_ID = (already set)
GOOGLE_CLIENT_SECRET = (already set)
JWT_SECRET = (already set)
NEXTAUTH_SECRET = (already set)
NEXTAUTH_URL = https://organic-food-app-ashy.vercel.app
```

5. Click "Save"
6. Redeploy: `vercel --prod`

---

## 6. Testing Checklist

### Product Images & Names
- [ ] Visit `/products` page
- [ ] See all products with images
- [ ] Click product to view details
- [ ] Images load correctly

### Invoice System
- [ ] Complete a checkout
- [ ] View order confirmation
- [ ] Access invoice from dashboard
- [ ] Invoice displays all details correctly
- [ ] Can print/download invoice

### Welcome Email (After Email Setup)
- [ ] Register new account
- [ ] Check email for welcome message
- [ ] Click links in email
- [ ] Verify all links work

### Password Reset (After Email Setup)
- [ ] Go to `/forgot-password`
- [ ] Enter email address
- [ ] Check email for reset link
- [ ] Click link and reset password
- [ ] Login with new password

---

## 7. Troubleshooting

### Emails Not Sending
**Problem**: Welcome/reset emails not received

**Solutions**:
1. Check `.env.local` has correct EMAIL_USER and EMAIL_PASSWORD
2. Verify Gmail app password (not regular password)
3. Check spam/promotions folder
4. Verify 2FA is enabled on Gmail account
5. Check Vercel environment variables are set

### Products Not Showing Images
**Problem**: Products display but no images

**Solutions**:
1. Verify images exist in `/public/images/products/`
2. Check image filenames match product names
3. Clear browser cache
4. Check browser console for 404 errors

### Invoice Not Displaying
**Problem**: Invoice page shows error

**Solutions**:
1. Verify order was completed successfully
2. Check order ID in URL is correct
3. Verify order data exists in `/data/orders/`
4. Check browser console for errors

---

## 8. Quick Start Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod

# Check for errors
npm run lint
npm run type-check
```

---

## 9. File Locations

| Feature | Files |
|---------|-------|
| Products | `src/lib/allProducts.ts`, `src/lib/productCatalog.ts` |
| Images | `/public/images/products/` |
| Invoice | `src/components/invoice/InvoiceTemplate.tsx`, `src/lib/invoiceData.ts` |
| Welcome Email | `src/lib/welcomeEmailService.ts` |
| Password Reset | `src/lib/passwordResetEmailService.ts` |
| Auth Routes | `src/app/api/auth/` |

---

## 10. Support

For issues or questions:
- Check browser console for errors
- Review server logs in Vercel dashboard
- Verify all environment variables are set
- Test locally first before deploying

