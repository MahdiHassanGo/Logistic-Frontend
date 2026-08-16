import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save, ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

export default function ReceivePaymentPage() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer") || searchParams.get("customerId");
  const invoiceId = searchParams.get("invoice");

  const { customers, invoices, addPayment } = useAppData();
  const navigate = useNavigate();

  let customer = customers.find(c => c.id === customerId);
  if (!customer && invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) customer = customers.find(c => c.id === inv.customerId);
  }
  if (!customer) customer = customers[0];

  const currentDue = customer ? customer.due : 0;
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const remainingDue = currentDue - amount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("পরিশোধের পরিমাণ 0 এর বেশি হতে হবে।");
      return;
    }
    if (amount > currentDue) {
      alert("পরিশোধের পরিমাণ বকেয়ার চেয়ে বেশি হতে পারে না।");
      return;
    }

    const newPayment = {
      id: `PAY-${Date.now()}`,
      customerId: customer.id,
      amount,
      method,
      reference,
      notes,
      date: new Date().toISOString()
    };

    addPayment(newPayment);
    customer.due -= amount;

    alert("পেমেন্ট সফলভাবে সংরক্ষিত হয়েছে!");
    navigate(`/app/customers/${customer.id}`);
  };

  const methodLabels = {
    CASH: "নগদ (Cash)",
    BANK: "ব্যাংক ট্রান্সফার",
    MOBILE: "মোবাইল ব্যাংকিং (Bkash/Nagad)",
    CHEQUE: "চেক (Cheque)"
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>পেমেন্ট গ্রহণ</h2>
          <p>গ্রাহকের বকেয়া পরিশোধ গ্রহণ করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> ফিরে যান
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Summary */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="section-card__body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>গ্রাহক</div>
                <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)" }}>{customer?.name}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{customer?.id} · {customer?.phone}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>বর্তমান বকেয়া</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--danger)", lineHeight: 1 }}>
                  ৳ {currentDue.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <CreditCard size={15} /> পেমেন্ট তথ্য
            </div>
            <div className="form-group">
              <label className="form-label">পরিশোধের পরিমাণ (৳) <span className="required">*</span></label>
              <input
                type="number"
                className="form-input"
                style={{ fontSize: "1.375rem", fontWeight: 700, height: "60px", borderColor: amount > 0 ? "var(--success)" : "var(--border)" }}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                min="0"
                max={currentDue}
                required
              />
              <span className="form-hint">সর্বোচ্চ পরিশোধযোগ্য: ৳ {currentDue.toLocaleString("en-IN")}</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">পেমেন্ট মেথড</label>
                <select className="form-input" value={method} onChange={e => setMethod(e.target.value)}>
                  <option value="CASH">নগদ (Cash)</option>
                  <option value="BANK">ব্যাংক ট্রান্সফার</option>
                  <option value="MOBILE">মোবাইল ব্যাংকিং (Bkash/Nagad)</option>
                  <option value="CHEQUE">চেক (Cheque)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">রেফারেন্স / ট্রানজাকশন আইডি</label>
                <input type="text" className="form-input" value={reference} onChange={e => setReference(e.target.value)} placeholder="ঐচ্ছিক" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">নোট</label>
              <textarea className="form-input" rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="পেমেন্ট সম্পর্কিত কোনো তথ্য..." />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="section-card" style={{ marginBottom: "1.5rem" }}>
          <div className="section-card__body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)" }}>বর্তমান বকেয়া</span>
              <span style={{ fontWeight: 600, color: "var(--danger)" }}>৳ {currentDue.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <span style={{ color: "var(--text-muted)" }}>পরিশোধ হচ্ছে</span>
              <span style={{ fontWeight: 600, color: "var(--success)" }}>— ৳ {amount.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "0.875rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "1.0625rem" }}>অবশিষ্ট বকেয়া</span>
              <span style={{
                fontWeight: 800,
                fontSize: "1.375rem",
                color: remainingDue > 0 ? "var(--danger)" : "var(--success)"
              }}>
                ৳ {remainingDue.toLocaleString("en-IN")}
              </span>
            </div>
            {remainingDue === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", color: "var(--success)", fontSize: "0.9375rem", fontWeight: 600 }}>
                <CheckCircle size={18} /> সম্পূর্ণ পরিশোধ হবে
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>বাতিল</button>
          <button type="submit" className="btn btn-success">
            <Save size={17} /> পেমেন্ট সেভ করুন
          </button>
        </div>
      </form>
    </div>
  );
}
