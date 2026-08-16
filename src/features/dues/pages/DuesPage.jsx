import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CreditCard, Bell, AlertCircle, TrendingDown } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

export default function DuesPage() {
  const { customers } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const dues = customers.filter(c => c.due > 0 &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
  ).sort((a, b) => b.due - a.due);

  const totalDues = dues.reduce((acc, c) => acc + c.due, 0);
  const highDueCount = dues.filter(c => c.due > 50000).length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>বকেয়া ব্যবস্থাপনা</h2>
          <p>সকল গ্রাহকের বকেয়া হিসাব ও আদায়ের তথ্য।</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon--red">
            <TrendingDown size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">সর্বমোট বকেয়া</div>
            <div className="stat-card__value" style={{ color: "var(--danger)" }}>৳ {totalDues.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--orange">
            <AlertCircle size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">বকেয়া গ্রাহক</div>
            <div className="stat-card__value">{dues.length} জন</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--red">
            <AlertCircle size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">উচ্চ বকেয়া (৳৫০,০০০+)</div>
            <div className="stat-card__value">{highDueCount} জন</div>
          </div>
        </div>
      </div>

      {/* Dues Table */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="toolbar" style={{ flex: 1 }}>
            <div className="search-box toolbar__search">
              <span className="search-box__icon"><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="গ্রাহকের নাম বা ফোন নম্বর খুঁজুন..."
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
                <th>গ্রাহক</th>
                <th>ফোন নম্বর</th>
                <th className="text-right">বকেয়া পরিমাণ (৳)</th>
                <th>স্ট্যাটাস</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {dues.map(cus => (
                <tr key={cus.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{cus.name}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{cus.id}</div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{cus.phone}</td>
                  <td className="text-right">
                    <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--danger)" }}>
                      ৳ {cus.due.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td>
                    {cus.due > 50000 ? (
                      <span className="badge badge--danger">
                        <span className="badge-dot" style={{ background: "var(--danger)" }} />
                        উচ্চ বকেয়া
                      </span>
                    ) : (
                      <span className="badge badge--warning">
                        <span className="badge-dot" style={{ background: "var(--warning)" }} />
                        বকেয়া আছে
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/app/payments/new?customerId=${cus.id}`)}
                      >
                        <CreditCard size={14} /> পেমেন্ট নিন
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        title="রিমাইন্ডার SMS"
                        onClick={() => alert("Reminder SMS Sent!")}
                      >
                        <Bell size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {dues.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <AlertCircle size={40} className="empty-state__icon" style={{ color: "var(--success)" }} />
                      <p className="empty-state__title">কোনো বকেয়া নেই</p>
                      <p className="empty-state__desc">সব গ্রাহকের পেমেন্ট পরিশোধ করা হয়েছে।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {dues.length > 0 && (
          <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border-soft)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            মোট {dues.length} জন গ্রাহকের বকেয়া রয়েছে
          </div>
        )}
      </div>
    </div>
  );
}
