'use client';

import React from 'react';
import { InvoiceTemplate, InvoiceData } from '@/components/InvoiceTemplate';
// NOTE: This page is a standalone invoice demo/editor. Production invoices are at /invoice/[orderId]

const mockInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-2026-0089',
  issueDate: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days later
  status: 'Unpaid',
  company: {
    name: 'Organic Harvest Co.',
    address: '123 Farm Road\nGreenway Valley, CA 90210\nUnited States',
    email: 'hello@organicharvest.com',
    phone: '+1 (555) 123-4567',
  },
  customer: {
    name: 'Sarah Jenkins',
    address: '456 Orchard Lane\nApt 4B\nSunnyville, FL 33101',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 987-6543',
  },
  items: [
    {
      id: '1',
      description: 'Organic Honeycrisp Apples (1 Dozen)',
      quantity: 2,
      unitPrice: 14.50,
      total: 29.00,
    },
    {
      id: '2',
      description: 'Free-range Eggs (Organic)',
      quantity: 3,
      unitPrice: 8.99,
      total: 26.97,
    },
    {
      id: '3',
      description: 'Artisan Sourdough Bread',
      quantity: 1,
      unitPrice: 6.50,
      total: 6.50,
    },
    {
      id: '4',
      description: 'Cold-pressed Green Juice (6-pack)',
      quantity: 1,
      unitPrice: 32.00,
      total: 32.00,
    }
  ],
  summary: {
    subtotal: 94.47,
    taxPercent: 8,
    taxAmount: 7.56,
    discountPercent: 0,
    discountAmount: 0,
    total: 102.03,
    festivalOfferActive: false,
  },
  notes: 'Deliver to back porch if no one is home. Quality checked and verified by inspector #42.',
  terms: 'Payment is due within 14 days. Late payments are subject to a 5% monthly fee. Refunds are only accepted within 48 hours for perishable goods.',
};

export default function InvoiceDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 sm:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Interactive Invoice System
          </h1>
          <p className="mt-4 text-xl text-gray-500 font-medium">
            Test the live price editor, PDF generation, and festival offers below!
          </p>
        </div>

        <InvoiceTemplate 
          initialData={mockInvoiceData}
          onPrint={() => window.print()}
        />
      </div>
    </div>
  );
}
