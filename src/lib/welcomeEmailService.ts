import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

const isConfigured =
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) &&
  process.env.EMAIL_USER !== 'your-email@gmail.com'

let transporter: Transporter | null = null

if (isConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

const APP_URL = (process.env.APP_BASE_URL || 'https://organic-food-app-ashy.vercel.app').trim()
const YEAR = new Date().getFullYear()

export async function sendWelcomeEmail(data: {
  to: string
  name: string
  isNewUser: boolean
}) {
  if (!transporter) {
    console.log(`[welcome-email] skipped for ${data.to} — email not configured`)
    return { sent: false }
  }

  const firstName = data.name?.split(' ')[0] || 'there'
  const subject = data.isNewUser
    ? '🌿 Welcome to Organic — Your Organic Journey Begins!'
    : `🌿 Welcome back to Organic, ${firstName}!`

  const html = data.isNewUser ? newUserHtml(firstName) : returningUserHtml(firstName)

  try {
    await transporter.sendMail({
      from: { name: 'Organic — Organic Food Store', address: process.env.EMAIL_USER! },
      to: data.to,
      subject,
      html,
    })
    console.log(`[welcome-email] sent to ${data.to}`)
    return { sent: true }
  } catch (err) {
    console.error('[welcome-email] failed:', err)
    return { sent: false }
  }
}

/* ─── NEW USER EMAIL ─────────────────────────────────────────────────────── */
function newUserHtml(firstName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Organi</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#111827;">

  <div style="max-width:620px;margin:40px auto 60px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

    <!-- ── HEADER ── -->
    <div style="background:linear-gradient(135deg,#16a34a 0%,#059669 60%,#047857 100%);padding:56px 40px 48px;text-align:center;">
      <div style="font-size:64px;line-height:1;margin-bottom:16px;">🌿</div>
      <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">
        Welcome to Organic!
      </h1>
      <p style="margin:14px 0 0;color:#bbf7d0;font-size:16px;font-weight:400;">
        India's Premium Organic Food Marketplace
      </p>
    </div>

    <!-- ── GREETING ── -->
    <div style="padding:44px 40px 0;">
      <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#15803d;">
        Hi ${firstName}! 👋
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#4b5563;line-height:1.85;">
        We're absolutely thrilled to have you join the <strong>Organic family</strong>! 🎉<br/>
        You've just taken a wonderful step towards a <strong>healthier, greener lifestyle</strong>.<br/>
        Every product on our platform is <strong>100% certified organic</strong> — sourced directly from trusted Indian farmers who care about the earth as much as you do.
      </p>

      <!-- ── DIVIDER ── -->
      <div style="height:2px;background:linear-gradient(90deg,#16a34a,#bbf7d0,#16a34a);border-radius:2px;margin-bottom:32px;"></div>

      <!-- ── WHAT YOU GET ── -->
      <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#111827;">✨ Here's what's waiting for you:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${benefitRow('🥦', 'Fresh Organic Products', '100+ certified organic fruits, vegetables, dairy, grains & more — delivered fresh to your door.')}
        ${benefitRow('🚚', 'Free Delivery', 'Enjoy free delivery on all orders above ₹500. Fast, reliable, and eco-friendly packaging.')}
        ${benefitRow('📦', 'Real-Time Order Tracking', 'Track every step of your order — from our warehouse to your doorstep, live.')}
        ${benefitRow('🌱', 'Support Indian Farmers', 'Every purchase directly supports certified organic farmers across India.')}
        ${benefitRow('🎁', 'Exclusive Offers', 'Festival deals, loyalty rewards, and member-only discounts — just for you.')}
      </table>

      <!-- ── CTA ── -->
      <div style="text-align:center;margin:40px 0 32px;">
        <a href="${APP_URL}/products"
           style="display:inline-block;background:linear-gradient(135deg,#16a34a,#059669);color:#ffffff;text-decoration:none;padding:18px 48px;border-radius:999px;font-weight:700;font-size:17px;letter-spacing:0.3px;box-shadow:0 6px 20px rgba(22,163,74,0.40);">
          🛒 &nbsp;Start Shopping Now
        </a>
      </div>

      <!-- ── PROMO BANNER ── -->
      <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px dashed #16a34a;border-radius:16px;padding:24px 28px;margin-bottom:36px;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:1px;">🎉 New Member Offer</p>
        <p style="margin:0 0 4px;font-size:26px;font-weight:800;color:#15803d;">Free Delivery</p>
        <p style="margin:0;font-size:14px;color:#166534;">on your first order — no minimum required!</p>
      </div>

      <!-- ── SUPPORT ── -->
      <div style="background:#f9fafb;border-radius:14px;padding:22px 28px;margin-bottom:36px;">
        <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#374151;">💬 Need help getting started?</p>
        <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
          Our team is here for you 7 days a week.<br/>
          📧 <a href="mailto:support@organicfood.com" style="color:#16a34a;font-weight:600;">support@organicfood.com</a>
          &nbsp;|&nbsp;
          📞 <span style="color:#16a34a;font-weight:600;">+91 1800-123-4567</span>
        </p>
      </div>

      <p style="margin:0 0 40px;font-size:14px;color:#9ca3af;text-align:center;line-height:1.7;">
        Thank you for choosing organic 🌱<br/>
        Together, we're building a healthier India.
      </p>
    </div>

    <!-- ── FOOTER ── -->
    ${emailFooter()}

  </div>
</body>
</html>`
}

/* ─── RETURNING USER EMAIL ───────────────────────────────────────────────── */
function returningUserHtml(firstName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome back to Organi</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#111827;">

  <div style="max-width:620px;margin:40px auto 60px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

    <!-- ── HEADER ── -->
    <div style="background:linear-gradient(135deg,#16a34a 0%,#059669 60%,#047857 100%);padding:56px 40px 48px;text-align:center;">
      <div style="font-size:64px;line-height:1;margin-bottom:16px;">🌿</div>
      <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">
        Welcome back, ${firstName}!
      </h1>
      <p style="margin:14px 0 0;color:#bbf7d0;font-size:16px;">
        Great to see you again 😊
      </p>
    </div>

    <!-- ── GREETING ── -->
    <div style="padding:44px 40px 0;">
      <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#15803d;">
        Hey ${firstName}! 👋
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#4b5563;line-height:1.85;">
        We've missed you! 🎉 You've just signed back into <strong>Organic</strong> — India's most trusted organic food marketplace.<br/>
        Fresh arrivals, new seasonal produce, and exclusive member deals are all waiting for you right now.
      </p>

      <!-- ── DIVIDER ── -->
      <div style="height:2px;background:linear-gradient(90deg,#16a34a,#bbf7d0,#16a34a);border-radius:2px;margin-bottom:32px;"></div>

      <!-- ── QUICK LINKS ── -->
      <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#111827;">🔥 Pick up where you left off:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${benefitRow('🛒', 'Shop Fresh Arrivals', 'New organic products added daily — fruits, vegetables, dairy, spices & more.')}
        ${benefitRow('📋', 'Your Order History', 'View all your past orders, download invoices, and reorder your favourites.')}
        ${benefitRow('❤️', 'Your Wishlist', 'Check the items you saved — they might be on sale today!')}
        ${benefitRow('🎁', 'Today\'s Offers', 'Festival deals and loyalty rewards updated just for returning members.')}
      </table>

      <!-- ── CTA BUTTONS ── -->
      <div style="text-align:center;margin:40px 0 32px;">
        <a href="${APP_URL}/products"
           style="display:inline-block;background:linear-gradient(135deg,#16a34a,#059669);color:#ffffff;text-decoration:none;padding:18px 40px;border-radius:999px;font-weight:700;font-size:16px;box-shadow:0 6px 20px rgba(22,163,74,0.40);margin:6px;">
          🛒 &nbsp;Shop Now
        </a>
        <a href="${APP_URL}/dashboard/customer"
           style="display:inline-block;background:#ffffff;color:#16a34a;text-decoration:none;padding:16px 40px;border-radius:999px;font-weight:700;font-size:16px;border:2px solid #16a34a;margin:6px;">
          📋 &nbsp;My Orders
        </a>
      </div>

      <!-- ── FRESHNESS BANNER ── -->
      <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px dashed #16a34a;border-radius:16px;padding:24px 28px;margin-bottom:36px;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:1px;">🌾 Did you know?</p>
        <p style="margin:0;font-size:15px;color:#166534;line-height:1.7;">
          All our products are harvested within <strong>24 hours</strong> of delivery.<br/>
          <strong>Farm-fresh. Always.</strong>
        </p>
      </div>

      <!-- ── SUPPORT ── -->
      <div style="background:#f9fafb;border-radius:14px;padding:22px 28px;margin-bottom:36px;">
        <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#374151;">💬 Need any help?</p>
        <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
          We're available 7 days a week.<br/>
          📧 <a href="mailto:support@organicfood.com" style="color:#16a34a;font-weight:600;">support@organicfood.com</a>
          &nbsp;|&nbsp;
          📞 <span style="color:#16a34a;font-weight:600;">+91 1800-123-4567</span>
        </p>
      </div>

      <p style="margin:0 0 40px;font-size:14px;color:#9ca3af;text-align:center;line-height:1.7;">
        Thank you for staying organic 🌱<br/>
        Your choices make a difference every single day.
      </p>
    </div>

    <!-- ── FOOTER ── -->
    ${emailFooter()}

  </div>
</body>
</html>`
}

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
function benefitRow(icon: string, title: string, desc: string) {
  return `<tr>
    <td style="padding:0 0 18px;vertical-align:top;width:52px;">
      <div style="width:44px;height:44px;background:#f0fdf4;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;text-align:center;line-height:44px;">
        ${icon}
      </div>
    </td>
    <td style="padding:0 0 18px 14px;vertical-align:top;">
      <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#111827;">${title}</p>
      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">${desc}</p>
    </td>
  </tr>`
}

function emailFooter() {
  return `<div style="background:#1f2937;padding:32px 40px;text-align:center;">
    <div style="font-size:32px;margin-bottom:10px;">🌿</div>
    <p style="margin:0 0 4px;color:#d1d5db;font-size:15px;font-weight:700;">Organic — Organic Food Store</p>
    <p style="margin:0 0 16px;color:#9ca3af;font-size:13px;">100% Certified Organic | Farm-to-Table | Delivered Across India</p>
    <div style="margin-bottom:16px;">
      <a href="${APP_URL}/products" style="color:#4ade80;text-decoration:none;font-size:13px;margin:0 10px;">Shop</a>
      <a href="${APP_URL}/about" style="color:#4ade80;text-decoration:none;font-size:13px;margin:0 10px;">About</a>
      <a href="${APP_URL}/contact" style="color:#4ade80;text-decoration:none;font-size:13px;margin:0 10px;">Contact</a>
    </div>
    <p style="margin:0;color:#6b7280;font-size:12px;">© ${YEAR} Organic. All rights reserved.</p>
  </div>`
}
