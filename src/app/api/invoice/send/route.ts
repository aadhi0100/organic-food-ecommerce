import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message, pdfBase64, invoiceNumber } = body;

    if (!to || !pdfBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure your SMTP transport
    // In a real app, environment variables should be used for these
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const pdfBuffer = Buffer.from(pdfBase64.split(',')[1], 'base64');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: subject || `Invoice #${invoiceNumber}`,
      text: message || `Dear Customer,\n\nPlease find attached the invoice #${invoiceNumber}.\n\nThank you for your business!`,
      attachments: [
        {
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
