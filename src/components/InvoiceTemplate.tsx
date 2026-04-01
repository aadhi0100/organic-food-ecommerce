import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Building2, Mail, Phone, MapPin, Download, Printer, Loader2, Send, Edit3, Save, Gift, Tag, Trash2, Plus } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate: Date | string;
  status?: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
  
  company: {
    name: string;
    logo?: string;
    address: string;
    email: string;
    phone: string;
  };
  
  customer: {
    name: string;
    address: string;
    email: string;
    phone?: string;
  };
  
  items: InvoiceItem[];
  
  summary: {
    subtotal: number;
    taxPercent?: number;
    taxAmount?: number;
    discountPercent?: number;
    discountAmount?: number;
    total: number;
    festivalOfferActive?: boolean;
    festivalOfferName?: string;
  };
  
  notes?: string;
  terms?: string;
}

interface InvoiceTemplateProps {
  initialData: InvoiceData;
  onPrint?: () => void;
  onDownloadPdf?: () => void;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ 
  initialData,
  onPrint,
  onDownloadPdf
}) => {
  const [data, setData] = useState<InvoiceData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailTarget, setEmailTarget] = useState(data.customer.email);

  // Recalculate totals whenever items or discounts change
  useEffect(() => {
    let subtotal = 0;
    const newItems = data.items.map(item => {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;
      return { ...item, total: lineTotal };
    });

    let discountAmount = 0;
    let taxAmount = 0;

    // Apply Festival Offer (e.g., flat 15% off) if active, else standard discount
    let currentDiscountPercent = data.summary.festivalOfferActive ? 15 : (data.summary.discountPercent || 0);

    if (currentDiscountPercent) {
      discountAmount = (subtotal * currentDiscountPercent) / 100;
    }

    if (data.summary.taxPercent) {
      taxAmount = ((subtotal - discountAmount) * data.summary.taxPercent) / 100;
    }

    const total = subtotal - discountAmount + taxAmount;

    setData(prev => ({
      ...prev,
      items: newItems,
      summary: {
        ...prev.summary,
        subtotal,
        discountPercent: currentDiscountPercent,
        discountAmount,
        taxAmount,
        total
      }
    }));
  }, [data.items, data.summary.taxPercent, data.summary.festivalOfferActive]); // Re-run if items, tax, or festival offer changes

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [
        ...prev.items, 
        { id: Math.random().toString(), description: 'New Item', quantity: 1, unitPrice: 0, total: 0 }
      ]
    }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const toggleFestivalOffer = () => {
    setData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        festivalOfferActive: !prev.summary.festivalOfferActive,
        festivalOfferName: !prev.summary.festivalOfferActive ? 'Holiday Special 15% OFF' : undefined
      }
    }));
  };

  const getPdfDataUri = async (): Promise<string | null> => {
    if (!invoiceRef.current) return null;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2, 
      useCORS: true, 
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    return pdf.output('datauristring');
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const dataUri = await getPdfDataUri();
      if (!dataUri) return;
      
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = `Invoice-${data.invoiceNumber}.pdf`;
      a.click();
      
      if (onDownloadPdf) onDownloadPdf();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleEmailInvoice = async () => {
    try {
      setIsEmailing(true);
      setEmailStatus('idle');
      
      const pdfBase64 = await getPdfDataUri(); // Gets the perfect screenshot PDF
      if (!pdfBase64) throw new Error("Could not generate PDF");

      const res = await fetch('/api/invoice/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailTarget,
          subject: `Your Invoice #${data.invoiceNumber} from ${data.company.name}`,
          pdfBase64,
          invoiceNumber: data.invoiceNumber
        }),
      });

      if (!res.ok) throw new Error('Failed to send email');
      setEmailStatus('success');
      setTimeout(() => setEmailStatus('idle'), 5000); // Reset after 5 sec
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
    } finally {
      setIsEmailing(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try { return format(new Date(date), 'MMMM dd, yyyy'); } 
    catch (e) { return String(date); }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
    }).format(amount);
  };

  const statusColors = {
    'Paid': 'bg-green-100 text-green-800 border-green-200',
    'Unpaid': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Overdue': 'bg-red-100 text-red-800 border-red-200',
    'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col mb-20 animate-in fade-in zoom-in duration-300">
      {/* Interactive Controls Ribbon (Not in PDF) */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-100 px-8 py-4 flex flex-wrap gap-4 justify-between items-center print:hidden shadow-md">
        <div className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-wide shadow-sm">Invoice Manager</span>
        </div>
        
        <div className="flex flex-wrap items-center space-x-3">
          <button 
            onClick={toggleFestivalOffer}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${data.summary.festivalOfferActive ? 'bg-amber-400 text-amber-900 hover:bg-amber-500 hover:scale-105' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            <Tag className="w-4 h-4" />
            <span>{data.summary.festivalOfferActive ? 'Festival Offer Active!' : 'Apply Festival Offer'}</span>
          </button>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditing ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Save Prices' : 'Manage Prices'}</span>
          </button>

          {onPrint && (
            <button 
              onClick={onPrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm font-medium text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          )}

          <button 
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGeneratingPdf ? 'Creating...' : 'PDF'}</span>
          </button>

          <div className="flex items-center space-x-2 bg-gray-700 p-1 pl-3 rounded-lg border border-gray-600 shadow-inner">
            <Mail className="w-4 h-4 text-gray-400" />
            <input 
              type="email" 
              value={emailTarget} 
              onChange={e => setEmailTarget(e.target.value)}
              className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder-gray-400 w-48"
              placeholder="customer@email.com"
            />
            <button 
              onClick={handleEmailInvoice}
              disabled={isEmailing}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed ${emailStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : emailStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isEmailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{emailStatus === 'success' ? 'Sent!' : emailStatus === 'error' ? 'Failed' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Document Body (Captured for PDF) */}
      <div ref={invoiceRef} className="p-8 sm:p-12 document-body bg-white relative">
        {data.summary.festivalOfferActive && (
          <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden pointer-events-none print:opacity-100 opacity-90">
            <div className="absolute top-8 -right-8 bg-amber-500 text-amber-900 font-bold px-12 py-2 transform rotate-45 shadow-lg border border-amber-400 text-center uppercase tracking-wider text-sm flex items-center space-x-2 justify-center w-[200px]">
              <Gift className="w-4 h-4 inline mr-1" />
              Festival!
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Company Info */}
          <div className="flex-1">
            {data.company.logo ? (
              <Image src={data.company.logo} alt={`${data.company.name} Logo`} width={160} height={64} className="h-16 w-auto object-contain mb-6 drop-shadow-sm" />
            ) : (
              <div className="flex items-center space-x-3 mb-6 animate-in fade-in slide-in-from-left duration-500">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl transform rotate-3">
                  <Building2 className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{data.company.name}</h1>
              </div>
            )}
            
            <div className="space-y-2 text-sm text-gray-500 font-medium">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-indigo-400" />
                <span className="whitespace-pre-line leading-relaxed">{data.company.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{data.company.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>{data.company.phone}</span>
              </div>
            </div>
          </div>

          {/* Invoice Details Container */}
          <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 min-w-[280px] shadow-sm backdrop-blur-sm">
            <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Invoice</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Number:</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{data.invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Issued:</span>
                <span className="font-medium text-gray-900">{formatDate(data.issueDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Due:</span>
                <span className="font-bold text-gray-900">{formatDate(data.dueDate)}</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm flex items-center gap-2 ${statusColors[data.status!]}`}>
                 <span className="relative flex h-2 w-2">
                   {data.status === 'Unpaid' || data.status === 'Overdue' ? (
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40"></span>
                   ) : null}
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                 </span>
                 {data.status}
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
             <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 px-4 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              Billed To
             </h3>
             <div className="h-0.5 flex-1 bg-gradient-to-l from-gray-200 to-transparent"></div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="text-xl font-bold text-gray-900 mb-3">{data.customer.name}</h4>
            <div className="space-y-3 text-sm text-gray-600 font-medium">
              <p className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                <span className="whitespace-pre-line leading-relaxed">{data.customer.address}</span>
              </p>
              <div className="flex gap-6 flex-wrap">
                <p className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{data.customer.email}</span>
                </p>
                {data.customer.phone && (
                  <p className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{data.customer.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-12 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="py-5 px-6">Description</th>
                <th className="py-5 px-6 text-center w-32">Qty</th>
                <th className="py-5 px-6 text-right w-40">Unit Price</th>
                <th className="py-5 px-6 text-right w-40">Total</th>
                {isEditing && <th className="py-5 px-4 text-center w-16"></th>}
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {data.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{item.description}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {isEditing ? (
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-center"
                      />
                    ) : (
                      <span className="font-medium bg-gray-100 px-3 py-1 rounded-full">{item.quantity}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right tabular-nums">
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full pl-7 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-right"
                        />
                      </div>
                    ) : (
                      formatCurrency(item.unitPrice)
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-bold tabular-nums text-gray-900 bg-gray-50/50">
                    {formatCurrency(item.total)}
                  </td>
                  {isEditing && (
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {isEditing && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={addItem}
                className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors border border-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          )}
        </div>

        {/* Summary Container */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          {/* Notes area (left) */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            {data.notes && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center space-x-2">
                   <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                   <span>Notes</span>
                </h4>
                <div className="p-5 bg-amber-50/50 rounded-xl text-sm text-amber-900 border border-amber-100 whitespace-pre-wrap leading-relaxed shadow-sm">
                  {data.notes}
                </div>
              </div>
            )}
            
            {data.terms && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center space-x-2">
                   <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                   <span>Terms & Conditions</span>
                </h4>
                <div className="p-5 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100 whitespace-pre-wrap leading-relaxed shadow-sm">
                  {data.terms}
                </div>
              </div>
            )}
          </div>

          {/* Totals area (right) */}
          <div className="w-full md:w-[380px] bg-white p-8 rounded-3xl border border-gray-200 shadow-lg relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-2xl z-0"></div>
            
            <div className="relative z-10 space-y-4 text-sm text-gray-600 font-medium pt-2">
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-gray-900 text-base">{formatCurrency(data.summary.subtotal)}</span>
              </div>
              
              {data.summary.discountAmount !== undefined && data.summary.discountAmount > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200 text-emerald-600 bg-emerald-50/50 -mx-4 px-4 py-2 rounded-lg">
                  <span className="flex items-center space-x-2">
                     <Tag className="w-4 h-4" />
                     <span>
                       Discount {data.summary.festivalOfferActive && <span className="font-bold">({data.summary.festivalOfferName})</span>}
                       {!data.summary.festivalOfferActive && data.summary.discountPercent ? `(${data.summary.discountPercent}%)` : ''}
                     </span>
                  </span>
                  <span className="font-bold tabular-nums">-{formatCurrency(data.summary.discountAmount)}</span>
                </div>
              )}
              
              {data.summary.taxAmount !== undefined && data.summary.taxAmount > 0 && (
                <div className="flex justify-between items-center pb-4">
                  <span>Tax {data.summary.taxPercent ? `(${data.summary.taxPercent}%)` : ''}</span>
                  <span className="font-semibold tabular-nums text-gray-900">{formatCurrency(data.summary.taxAmount)}</span>
                </div>
              )}
              
              <div className="pt-5 mt-2 border-t-2 border-gray-900">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 uppercase tracking-wider">Total</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tabular-nums">
                    {formatCurrency(data.summary.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center bg-gray-50 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 rounded-b-xl mt-4">
          <p className="text-base text-gray-800 font-bold tracking-wide">
            Thank you for your business!
          </p>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            If you have any questions about this invoice, please contact <span className="font-bold text-gray-700">{data.company.email}</span> or call <span className="font-bold text-gray-700">{data.company.phone}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
