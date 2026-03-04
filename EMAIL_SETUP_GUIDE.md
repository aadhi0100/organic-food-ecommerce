# 📧 Email Invoice Setup Guide

## Overview
Your e-commerce application now has a **professional invoice system** that:
- ✅ Generates beautiful PDF invoices automatically
- ✅ Sends invoices via email to customers
- ✅ Allows customers to download invoices from their dashboard
- ✅ Saves all invoices locally in `data/receipts/` folder

## Current Status
🟡 **Email delivery is NOT configured** - Invoices are being saved locally but not sent via email.

## How to Enable Email Delivery

### Step 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Windows Computer" as the device
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Update .env.local File

Open the `.env.local` file in your project root and update these lines:

```env
# Replace with your actual Gmail address
EMAIL_USER=your-actual-email@gmail.com

# Replace with the 16-character app password (remove spaces)
EMAIL_PASSWORD=abcdefghijklmnop
```

**Example:**
```env
EMAIL_USER=organicstore@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
```

### Step 3: Restart the Server

After updating the `.env.local` file:

1. Stop the development server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

## Testing Email Delivery

1. **Place a test order** on your website
2. **Check the console** - you should see:
   ```
   ✅ INVOICE EMAIL SENT SUCCESSFULLY!
   📧 To: customer@example.com
   🏷️ Order: ORD1234567890
   💰 Amount: ₹500.00
   ```
3. **Check the customer's email inbox** for the invoice

## Features

### 1. Professional Invoice PDF
- Company branding with logo and colors
- Detailed order information
- Customer and shipping details
- Itemized product list with prices
- Tax and total calculations
- Delivery tracking information
- Terms and conditions

### 2. Beautiful Email Template
- Responsive HTML design
- Order confirmation message
- Delivery tracking number
- Expected delivery date
- PDF invoice attached
- Support contact information

### 3. Download from Dashboard
Customers can download their invoices anytime from:
- **Customer Dashboard** → Order History → "📄 Download Invoice" button

## File Locations

- **Invoice PDFs**: `data/receipts/invoice-[ORDER_ID].pdf`
- **Invoice Generator**: `src/lib/professionalInvoice.ts`
- **Email Service**: `src/lib/invoiceEmailService.ts`
- **API Endpoint**: `src/app/api/orders/[orderId]/invoice/route.ts`

## Troubleshooting

### Email Not Sending?

1. **Check .env.local file**:
   - Make sure `EMAIL_USER` is your actual Gmail address
   - Make sure `EMAIL_PASSWORD` is the 16-character app password (no spaces)
   - Make sure there are no quotes around the values

2. **Check Gmail settings**:
   - 2-Step Verification must be enabled
   - App Password must be generated correctly

3. **Check console logs**:
   - Look for error messages in the terminal
   - Common errors:
     - "Invalid login" → Wrong email or password
     - "Less secure app" → Use App Password, not regular password

4. **Restart the server** after any changes to `.env.local`

### Invoice Not Downloading?

1. **Check browser settings** - allow downloads from localhost
2. **Check console** for errors
3. **Verify order exists** in the database

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Never share your App Password
- Use App Passwords, not your regular Gmail password
- Revoke App Passwords if compromised

## Alternative Email Services

If you don't want to use Gmail, you can modify `src/lib/invoiceEmailService.ts` to use:
- **SendGrid**
- **AWS SES**
- **Mailgun**
- **Postmark**

## Support

If you need help:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure the server is restarted after changes
4. Test with a simple order first

---

**Last Updated**: January 2025
**Version**: 1.0.0
