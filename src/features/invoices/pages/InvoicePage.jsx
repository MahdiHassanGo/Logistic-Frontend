import { useParams, useNavigate } from "react-router-dom";
import { Printer, Download, MessageSquare, CreditCard, ArrowLeft, HardHat } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/invoice.css";

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, customers } = useAppData();

  const invoice = invoices.find(i => i.id === id);
  if (!invoice) return <div className="card">Invoice not found.</div>;

  const customer = customers.find(c => c.id === invoice.customerId);

  const handlePrint = () => {
    window.print();
  };

  const handleSMS = () => {
    alert("SMS frontend simulation completed");
  };

  return (
    <div className="invoice-page-wrapper">
      <div className="invoice-actions">
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ marginRight: "auto" }}>
          <ArrowLeft size={18} /><span>Back</span>
        </button>
        <button className="btn-outline" onClick={handleSMS}>
          <MessageSquare size={18} /><span>SMS</span>
        </button>
        <button className="btn-outline" onClick={() => alert("PDF Download simulation")}>
          <Download size={18} /><span>PDF</span>
        </button>
        <button className="btn-primary" style={{ background: "var(--success)" }} onClick={() => navigate(`/payments/new?invoice=${invoice.id}`)}>
          <CreditCard size={18} /><span>Payment</span>
        </button>
        <button className="btn-primary" onClick={handlePrint}>
          <Printer size={18} /><span>Print</span>
        </button>
      </div>

      <div className="invoice-sheet">
        <div className="invoice-header">
          <div className="invoice-company">
            <div className="invoice-company-logo">
              <HardHat size={28} /> Digikhata
            </div>
            <div className="invoice-company-details">
              <p>রড, সিমেন্ট ও নির্মাণ সামগ্রী</p>
              <p>ফোন: ০১৭১১-২২৩৩৪৪</p>
              <p>ইমেইল: info@digikhata.com</p>
            </div>
          </div>
          <div className="invoice-title">
            <h1>চালান / INVOICE</h1>
            <p>নির্মাণ সামগ্রী বিক্রয়</p>
          </div>
        </div>

        <div className="invoice-meta">
          <div className="invoice-bill-to">
            <h3>গ্রাহক (Bill To)</h3>
            <p><strong>{customer?.name}</strong></p>
            <p>{customer?.businessName}</p>
            <p>{customer?.address}</p>
            <p>ফোন: {customer?.phone}</p>
          </div>
          
          <table className="invoice-details-table">
            <tbody>
              <tr>
                <td>ইনভয়েস নম্বর:</td>
                <td><strong>{invoice.id}</strong></td>
              </tr>
              <tr>
                <td>তারিখ:</td>
                <td>{new Date(invoice.date).toLocaleDateString('bn-BD')}</td>
              </tr>
              <tr>
                <td>স্ট্যাটাস:</td>
                <td style={{ color: invoice.status === 'PAID' ? '#16a34a' : '#dc2626', fontWeight: "bold" }}>
                  {invoice.status === 'PAID' ? 'পরিশোধিত' : 'বকেয়া'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <table className="invoice-items">
          <thead>
            <tr>
              <th style={{ width: "4%" }}>#</th>
              <th style={{ width: "52%" }}>পণ্যের বিবরণ</th>
              <th style={{ width: "12%", textAlign: "center" }}>পরিমাণ</th>
              <th style={{ width: "14%", textAlign: "right" }}>দর (৳)</th>
              <th style={{ width: "18%", textAlign: "right" }}>মোট (৳)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: "right" }}>{((item.quantity * item.unitPrice) - item.discount).toLocaleString('en-IN')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>1</td>
                <td>পণ্য বিবরণী নেই (Mock)</td>
                <td style={{ textAlign: "center" }}>1</td>
                <td style={{ textAlign: "right" }}>{invoice.amount.toLocaleString('en-IN')}</td>
                <td style={{ textAlign: "right" }}>{invoice.amount.toLocaleString('en-IN')}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="invoice-totals-row">
            <span>সাবটোটাল:</span>
            <span>৳ {invoice.amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="invoice-totals-row">
            <span>পূর্বের বকেয়া:</span>
            <span>৳ 0</span>
          </div>
          <div className="invoice-totals-row">
            <span>জমা (পরিশোধ):</span>
            <span>৳ {invoice.paid.toLocaleString('en-IN')}</span>
          </div>
          <div className="invoice-totals-row invoice-totals-row--grand">
            <span>মোট বকেয়া:</span>
            <span>৳ {invoice.due.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <div className="invoice-notes">
            <h4>নোট:</h4>
            <p>আমাদের সাথে ব্যবসা করার জন্য আপনাকে আন্তরিক ধন্যবাদ। মাল বুঝে নেওয়ার পর কোনো অভিযোগ গ্রহণযোগ্য নয়।</p>
          </div>
          <div className="invoice-signature">
            <div className="invoice-signature-line"></div>
            <p>অনুমোদিত স্বাক্ষর</p>
          </div>
        </div>
      </div>
    </div>
  );
}
