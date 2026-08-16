import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText, ShoppingCart } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const statusLabels = {
  PAID: { label: "পরিশোধিত", variant: "success" },
  UNPAID: { label: "বকেয়া", variant: "danger" },
  PARTIAL: { label: "আংশিক", variant: "warning" },
};

export default function PurchasesListPage() {
  const { purchases, customers } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = purchases.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "ALL" || p.status === statusFilter)
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ক্রয় তালিকা</h2>
          <p>সকল বিক্রয় ও ক্রয় অর্ডারের রেকর্ড।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => navigate("/app/purchases/new")}>
            <Plus size={17} /> নতুন ক্রয়
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
                placeholder="ইনভয়েস নম্বর দিয়ে খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">সব স্ট্যাটাস</option>
              <option value="PAID">পরিশোধিত</option>
              <option value="UNPAID">বকেয়া</option>
              <option value="PARTIAL">আংশিক</option>
            </select>
          </div>
        </div>

        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>ইনভয়েস নং</th>
                <th>তারিখ</th>
                <th>গ্রাহক</th>
                <th className="text-right">মোট (৳)</th>
                <th className="text-right">পরিশোধ (৳)</th>
                <th>স্ট্যাটাস</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cus = customers.find(c => c.id === p.customerId);
                const status = statusLabels[p.status] || { label: p.status, variant: "neutral" };
                return (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.875rem", fontFamily: "monospace" }}>{p.id}</span>
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {new Date(p.date).toLocaleDateString("bn-BD")}
                    </td>
                    <td style={{ fontWeight: 500 }}>{cus ? cus.name : p.customerId}</td>
                    <td className="text-right" style={{ fontWeight: 600 }}>
                      ৳ {p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="text-right" style={{ color: "var(--success)", fontWeight: 600 }}>
                      ৳ {p.paid.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className={`badge badge--${status.variant}`}>{status.label}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        title="ইনভয়েস দেখুন"
                        onClick={() => navigate(`/app/purchases/${p.id}`)}
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
                      <ShoppingCart size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো ক্রয় রেকর্ড নেই</p>
                      <p className="empty-state__desc">নতুন ক্রয় অর্ডার যোগ করুন।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border-soft)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            মোট {filtered.length}টি ক্রয় রেকর্ড
          </div>
        )}
      </div>
    </div>
  );
}
