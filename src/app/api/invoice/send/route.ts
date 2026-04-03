import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
    const token = match ? decodeURIComponent(match[1] || '') : ''
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    try { await verifySession(token) } catch { return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }

    const body = await request.json();
    const { to, subject, message, pdfBase64, invoiceNumber } = body;

    if (!to || !pdfBase64 || !invoiceNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!EMAIL_RE.test(String(to))) {
      return NextResponse.json({ error: 'Invalid recipient email' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const base64Data = String(pdfBase64).includes(',') ? pdfBase64.split(',')[1] : pdfBase64
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    const safeInvoiceNumber = String(invoiceNumber).replace(/[^a-zA-Z0-9_-]/g, '')

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: String(to),
      subject: subject ? String(subject).slice(0, 200) : `Invoice #${safeInvoiceNumber}`,
      text: message ? String(message).slice(0, 2000) : `Please find attached invoice #${safeInvoiceNumber}.`,
      attachments: [{ filename: `Invoice-${safeInvoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }],
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
