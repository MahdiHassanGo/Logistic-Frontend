import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const statusLabels = {
  PAID: { label: "পরিশোধিত", variant: "success" },
  UNPAID: { label: "বকেয়া", variant: "danger" },
  PARTIAL: { label: "আংশিক", variant: "warning" },
};

export default function InvoicesListPage() {
  const { invoices, customers } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = invoices.filter(i =>
    i.id.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "ALL" || i.status === statusFilter)
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ইনভয়েস তালিকা</h2>
          <p>সকল ইনভয়েসের রেকর্ড ও পেমেন্ট স্ট্যাটাস।</p>
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
                <th className="text-right">সর্বমোট (৳)</th>
                <th className="text-right">বকেয়া (৳)</th>
                <th>স্ট্যাটাস</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const cus = customers.find(c => c.id === inv.customerId);
                const status = statusLabels[inv.status] || { label: inv.status, variant: "neutral" };
                return (
                  <tr key={inv.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.875rem", fontFamily: "monospace" }}>{inv.id}</span>
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {new Date(inv.date).toLocaleDateString("bn-BD")}
                    </td>
                    <td style={{ fontWeight: 500 }}>{cus ? cus.name : inv.customerId}</td>
                    <td className="text-right" style={{ fontWeight: 600 }}>
                      ৳ {inv.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="text-right">
                      <span style={{ fontWeight: 700, color: inv.due > 0 ? "var(--danger)" : "var(--success)" }}>
                        ৳ {inv.due.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge--${status.variant}`}>{status.label}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        title="ইনভয়েস দেখুন"
                        onClick={() => navigate(`/app/invoices/${inv.id}`)}
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
                      <FileText size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো ইনভয়েস নেই</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border-soft)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            মোট {filtered.length}টি ইনভয়েস
          </div>
        )}
      </div>
    </div>
  );
}
