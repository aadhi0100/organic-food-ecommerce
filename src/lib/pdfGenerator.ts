import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const PDFGenerator = {
  // Admin Report
  generateAdminReport: (data: any) => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('Admin Sales Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
    
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', `₹${data.totalRevenue || 0}`],
        ['Total Orders', data.totalOrders || 0],
        ['Total Products', data.totalProducts || 0],
        ['Active Vendors', data.activeVendors || 0],
        ['Total Customers', data.totalCustomers || 0],
      ],
    })
    
    doc.save('admin-report.pdf')
  },

  // Vendor Report
  generateVendorReport: (data: any) => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('Vendor Sales Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
    
    autoTable(doc, {
      startY: 40,
      head: [['Product', 'Sales', 'Revenue']],
      body: data.products?.map((p: any) => [
        p.name,
        p.sales || 0,
        `₹${p.revenue || 0}`
      ]) || [],
    })
    
    doc.save('vendor-report.pdf')
  },

  // Customer Receipt
  generateReceipt: (order: any) => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('Order Receipt', 14, 20)
    doc.setFontSize(10)
    doc.text(`Order ID: ${order.id}`, 14, 30)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36)
    
    doc.text('Shipping Address:', 14, 46)
    doc.text(order.shippingAddress.fullName, 14, 52)
    doc.text(order.shippingAddress.street, 14, 58)
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 14, 64)
    
    autoTable(doc, {
      startY: 75,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: order.items.map((item: any) => [
        item.product?.name || 'Product',
        item.quantity,
        `₹${item.product?.price || 0}`,
        `₹${(item.product?.price || 0) * item.quantity}`
      ]),
      foot: [['', '', 'Total:', `₹${order.total}`]],
    })
    
    return doc.output('blob')
  },

  downloadReceipt: (order: any) => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('Order Receipt', 14, 20)
    doc.setFontSize(10)
    doc.text(`Order ID: ${order.id}`, 14, 30)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36)
    
    doc.text('Shipping Address:', 14, 46)
    doc.text(order.shippingAddress.fullName, 14, 52)
    doc.text(order.shippingAddress.street, 14, 58)
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 14, 64)
    
    autoTable(doc, {
      startY: 75,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: order.items.map((item: any) => [
        item.product?.name || 'Product',
        item.quantity,
        `₹${item.product?.price || 0}`,
        `₹${(item.product?.price || 0) * item.quantity}`
      ]),
      foot: [['', '', 'Total:', `₹${order.total}`]],
    })
    
    doc.save(`receipt-${order.id}.pdf`)
  }
}
