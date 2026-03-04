import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceData {
  orderId: string
  orderDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  deliveryDate: string
  trackingNumber: string
  paymentMethod: string
}

export function generateProfessionalInvoice(data: InvoiceData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  
  // Premium Header with Gradient Effect
  doc.setFillColor(22, 163, 74)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setFillColor(21, 128, 61)
  doc.rect(0, 35, pageWidth, 10, 'F')
  
  // Company Logo Area
  doc.setFillColor(255, 255, 255)
  doc.circle(25, 22, 8, 'F')
  doc.setFontSize(20)
  doc.setTextColor(22, 163, 74)
  doc.text('OF', 25, 25, { align: 'center' })
  
  // Company Name & Tagline
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('ORGANIC FOOD STORE', 45, 22)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Premium Organic Products | Farm to Table | 100% Certified', 45, 29)
  doc.text('Email: info@organicfood.com | Phone: +91 1800-123-4567 | Web: www.organicfood.com', 45, 36)
  
  // Invoice Title Badge
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(155, 10, 40, 15, 2, 2, 'F')
  doc.setTextColor(22, 163, 74)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 175, 20, { align: 'center' })
  
  // Invoice Details Box
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(140, 52, 55, 28, 2, 2, 'F')
  doc.setDrawColor(22, 163, 74)
  doc.setLineWidth(0.5)
  doc.roundedRect(140, 52, 55, 28, 2, 2, 'S')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice No:', 143, 58)
  doc.setFont('helvetica', 'normal')
  doc.text(data.orderId, 143, 63)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Date:', 143, 69)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(data.orderDate).toLocaleDateString('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  }), 143, 74)
  
  // Customer Details Section
  doc.setFillColor(240, 253, 244)
  doc.roundedRect(15, 52, 60, 35, 2, 2, 'F')
  doc.setDrawColor(22, 163, 74)
  doc.roundedRect(15, 52, 60, 35, 2, 2, 'S')
  
  doc.setTextColor(22, 163, 74)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO', 18, 58)
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(data.customerName, 18, 65)
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Email: ${data.customerEmail}`, 18, 71)
  doc.text(`Phone: ${data.customerPhone}`, 18, 76)
  
  // Shipping Address Section
  doc.setFillColor(240, 253, 244)
  doc.roundedRect(80, 52, 55, 35, 2, 2, 'F')
  doc.setDrawColor(22, 163, 74)
  doc.roundedRect(80, 52, 55, 35, 2, 2, 'S')
  
  doc.setTextColor(22, 163, 74)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('SHIP TO', 83, 58)
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  let yPos = 64
  if (data.shippingAddress.street) {
    const addressLines = doc.splitTextToSize(data.shippingAddress.street, 50)
    addressLines.forEach((line: string) => {
      doc.text(line, 83, yPos)
      yPos += 4
    })
  }
  doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state}`, 83, yPos)
  yPos += 4
  doc.text(`${data.shippingAddress.zipCode}, ${data.shippingAddress.country}`, 83, yPos)
  
  // Delivery & Payment Info
  doc.setFillColor(254, 249, 195)
  doc.roundedRect(15, 92, 180, 18, 2, 2, 'F')
  doc.setDrawColor(234, 179, 8)
  doc.setLineWidth(1)
  doc.roundedRect(15, 92, 180, 18, 2, 2, 'S')
  
  doc.setTextColor(146, 64, 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DELIVERY INFO', 18, 98)
  doc.setFont('helvetica', 'normal')
  const deliveryDate = new Date(data.deliveryDate)
  doc.text(`Expected: ${deliveryDate.toLocaleDateString('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  })}`, 18, 104)
  
  doc.setFont('helvetica', 'bold')
  doc.text('TRACKING', 100, 98)
  doc.setFont('helvetica', 'normal')
  doc.text(data.trackingNumber, 100, 104)
  
  doc.setFont('helvetica', 'bold')
  doc.text('PAYMENT', 155, 98)
  doc.setFont('helvetica', 'normal')
  doc.text(data.paymentMethod, 155, 104)
  
  // Items Table
  autoTable(doc, {
    startY: 118,
    head: [['ITEM DESCRIPTION', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: data.items.map(item => [
      item.name,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${item.total.toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 100, halign: 'left' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    }
  })
  
  // Summary Section
  const finalY = (doc as any).lastAutoTable.finalY + 10
  
  doc.setFillColor(249, 250, 251)
  doc.roundedRect(130, finalY - 5, 65, 35, 2, 2, 'F')
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  doc.text('Subtotal:', 135, finalY)
  doc.text(`₹${data.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' })
  
  doc.text('Tax (GST 5%):', 135, finalY + 6)
  doc.text(`₹${data.tax.toFixed(2)}`, 190, finalY + 6, { align: 'right' })
  
  doc.text('Shipping Charges:', 135, finalY + 12)
  doc.text(data.shipping === 0 ? 'FREE' : `₹${data.shipping.toFixed(2)}`, 190, finalY + 12, { align: 'right' })
  
  doc.setDrawColor(22, 163, 74)
  doc.setLineWidth(0.5)
  doc.line(135, finalY + 16, 190, finalY + 16)
  
  doc.setFillColor(22, 163, 74)
  doc.roundedRect(130, finalY + 18, 65, 10, 2, 2, 'F')
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text('TOTAL AMOUNT:', 135, finalY + 25)
  doc.text(`₹${data.total.toFixed(2)}`, 190, finalY + 25, { align: 'right' })
  
  // Terms & Conditions
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Terms & Conditions:', 15, finalY + 5)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('• All products are 100% organic and certified', 15, finalY + 10)
  doc.text('• Delivery within 3-5 business days', 15, finalY + 14)
  doc.text('• For queries, contact support@organicfood.com', 15, finalY + 18)
  
  // Footer
  const footerY = 275
  doc.setFillColor(22, 163, 74)
  doc.rect(0, footerY, pageWidth, 22, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Thank you for choosing Organic Food Store!', pageWidth / 2, footerY + 8, { align: 'center' })
  
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Fresh Organic Products | Fast Delivery | 100% Quality Assured', pageWidth / 2, footerY + 13, { align: 'center' })
  doc.text('This is a computer-generated invoice and does not require a signature', pageWidth / 2, footerY + 17, { align: 'center' })
  
  return doc
}

export function calculateDeliveryDate(orderDate: string): string {
  const date = new Date(orderDate)
  date.setDate(date.getDate() + 3) // 3 days delivery
  return date.toISOString()
}

export function generateTrackingNumber(): string {
  return 'ORG' + Date.now().toString().slice(-10)
}
