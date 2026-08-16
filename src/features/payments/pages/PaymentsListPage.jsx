import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, CreditCard, FileText } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const methodLabels = {
  CASH: "নগদ",
  BANK: "ব্যাংক",
  MOBILE: "মোবাইল ব্যাংকিং",
  CHEQUE: "চেক",
};

export default function PaymentsListPage() {
  const { payments, customers } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = payments.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    (p.reference && p.reference.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>পেমেন্ট তালিকা</h2>
          <p>সকল পেমেন্ট রসিদ ও লেনদেনের রেকর্ড।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => navigate("/app/payments/new")}>
            <Plus size={17} /> পেমেন্ট গ্রহণ
          </button>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card__header">
          <div className="toolbar" style={{ flex: 1 }}>
            <div className="search-box toolbar__search">
              <span className="search-box__icon"><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="পেমেন্ট আইডি বা রেফারেন্স..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>রসিদ নম্বর</th>
                <th>তারিখ</th>
                <th>গ্রাহক</th>
                <th>মেথড</th>
                <th className="text-right">পরিমাণ (৳)</th>
                <th>রেফারেন্স</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cus = customers.find(c => c.id === p.customerId);
                return (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)" }}>{p.id}</span>
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {new Date(p.date).toLocaleDateString("bn-BD")}
                    </td>
                    <td style={{ fontWeight: 500 }}>{cus ? cus.name : p.customerId}</td>
                    <td>
                      <span className="badge badge--neutral">{methodLabels[p.method] || p.method}</span>
                    </td>
                    <td className="text-right" style={{ fontWeight: 700, color: "var(--success)" }}>
                      ৳ {p.amount.toLocaleString("en-IN")}
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {p.reference || <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        title="বিস্তারিত দেখুন"
                        onClick={() => navigate(`/app/payments/${p.id}`)}
                      >
                        <FileText size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <CreditCard size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো পেমেন্ট রেকর্ড নেই</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border-soft)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            মোট {filtered.length}টি পেমেন্ট রেকর্ড
          </div>
        )}
      </div>
    </div>
  );
}
