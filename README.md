# Organic Food E-Commerce App

Premium organic food marketplace for the Indian market with multi-role support (customers, vendors, admins).

## Features

- 🛒 Product discovery, cart, wishlist, checkout, order tracking
- 👨‍💼 Vendor product/order management, analytics
- 🔐 Admin user/product/order oversight, data export
- 📱 PWA support with offline capabilities
- 🌙 Dark mode
- 🔔 Real-time notifications
- 🇮🇳 Indian localization (₹, festivals, regional payments)
- 🌐 Multi-language support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2+
- **Styling**: Tailwind CSS 3.3.5
- **State**: Zustand, React Context
- **Auth**: Google OAuth 2.0 (Authorization Code + PKCE)
- **Database**: File-based JSON storage
- **Payments**: Stripe, Indian payment methods
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your credentials
```

### Environment Variables

Required variables in `.env.local`:

```env
# App
APP_BASE_URL=http://localhost:3000
APP_SESSION_SECRET=replace_with_random_32_bytes_hex

# Google OAuth 2.0
GOOGLE_CLIENT_ID=replace_with_google_oauth_client_id
GOOGLE_CLIENT_SECRET=replace_with_google_oauth_client_secret

# Role mapping (comma-separated, optional). If not listed, users become `customer`.
AUTH_ADMIN_EMAILS=admin@example.com
AUTH_VENDOR_EMAILS=vendor@example.com

# Email (Optional - for invoice delivery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Firebase (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Google OAuth Setup

1. Google Cloud Console → APIs & Services → Credentials
2. Create credentials → OAuth client ID → Web application
3. Add Authorized redirect URI: `${APP_BASE_URL}/api/auth/google/callback`
4. Copy `Client ID` and `Client secret` into `.env.local`
5. (Optional) Set `AUTH_ADMIN_EMAILS` / `AUTH_VENDOR_EMAILS` to map roles

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Type checking
npm run type-check

# Linting
npm run lint
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure environment variables in Vercel dashboard
6. Click "Deploy"

### Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

- `APP_BASE_URL` (https://your-domain.vercel.app)
- `APP_SESSION_SECRET` (Production)
- `GOOGLE_CLIENT_ID` (Production)
- `GOOGLE_CLIENT_SECRET` (Production)
- `AUTH_ADMIN_EMAILS` (Optional)
- `AUTH_VENDOR_EMAILS` (Optional)
- `EMAIL_USER` (Optional)
- `EMAIL_PASSWORD` (Optional)
- Firebase variables (Optional)
- Stripe variables (Optional)

### Post-Deployment

1. Update `APP_BASE_URL` in Vercel environment variables to your production URL
2. Test authentication flow
3. Verify email delivery (if configured)
4. Test payment integration (if configured)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboards
│   ├── product/           # Product pages
│   └── [pages]/           # Other routes
├── components/            # React components
├── context/               # Global state providers
├── hooks/                 # Custom hooks
├── lib/                   # Business logic
├── services/              # External integrations
├── types/                 # TypeScript types
├── utils/                 # Helper functions
└── middleware.ts          # Auth/routing middleware

data/                      # File-based storage
├── users/, products/, orders/, carts/
├── logs/, exports/, backups/

public/                    # Static assets
├── images/, icons/, videos/
├── manifest.json          # PWA manifest
└── sw.js                  # Service worker
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm test` - Run tests
- `npm run analyze` - Analyze bundle size

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
                                  
