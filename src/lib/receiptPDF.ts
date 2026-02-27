import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function generateReceiptPDF(receipt: any): Promise<Buffer> {
  const doc = new jsPDF()
  
  doc.setFontSize(20)
  doc.text('Order Receipt', 14, 20)
  doc.setFontSize(10)
  doc.text(`Order ID: ${receipt.orderId}`, 14, 30)
  doc.text(`Date: ${new Date(receipt.orderDate).toLocaleDateString()}`, 14, 36)
  doc.text(`Customer: ${receipt.customerName}`, 14, 42)
  
  let yPos = 55
  
  receipt.addresses.forEach((addr: any, idx: number) => {
    doc.text(`Address ${idx + 1}:`, 14, yPos)
    yPos += 6
    doc.text(`${addr.fullName}`, 14, yPos)
    yPos += 6
    doc.text(`${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`, 14, yPos)
    yPos += 6
    if (addr.location) {
      doc.text(`Location: ${addr.location.lat}, ${addr.location.lng}`, 14, yPos)
      yPos += 6
    }
    yPos += 4
  })
  
  autoTable(doc, {
    startY: yPos,
    head: [['Product', 'Qty', 'Price', 'Total']],
    body: receipt.items.map((item: any) => [
      item.product?.name || 'Product',
      item.quantity,
      `₹${item.product?.price || 0}`,
      `₹${(item.product?.price || 0) * item.quantity}`
    ]),
    foot: [['', '', 'Total:', `₹${receipt.total}`]],
  })
  
  return Buffer.from(doc.output('arraybuffer'))
}
