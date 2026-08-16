import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Truck, Package } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const statusConfig = {
  DELIVERED: { label: "ডেলিভারি হয়েছে", variant: "success" },
  PENDING: { label: "অপেক্ষমাণ", variant: "warning" },
  IN_TRANSIT: { label: "চলমান", variant: "info" },
  ASSIGNED: { label: "নিযুক্ত", variant: "primary" },
};

export default function DeliveriesListPage() {
  const { deliveries } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = deliveries.filter(d =>
    (d.id.toLowerCase().includes(search.toLowerCase()) ||
    d.destination.toLowerCase().includes(search.toLowerCase()) ||
    (d.driverName || "").toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || d.status === statusFilter)
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ডেলিভারি তালিকা</h2>
          <p>সকল ডেলিভারি অর্ডার ট্র্যাক ও পরিচালনা করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => navigate("/app/transport/deliveries/new")}>
            <Plus size={17} /> নতুন ডেলিভারি
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="toolbar" style={{ flex: 1 }}>
            <div className="search-box toolbar__search">
              <span className="search-box__icon"><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="ডেলিভারি নং, গন্তব্য বা ড্রাইভার..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">সব স্ট্যাটাস</option>
              <option value="PENDING">অপেক্ষমাণ</option>
              <option value="ASSIGNED">নিযুক্ত</option>
              <option value="IN_TRANSIT">চলমান</option>
              <option value="DELIVERED">সম্পন্ন</option>
            </select>
          </div>
        </div>

        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>ডেলিভারি নং</th>
                <th>তারিখ</th>
                <th>গন্তব্য</th>
                <th>ড্রাইভার</th>
                <th>গাড়ি</th>
                <th>স্ট্যাটাস</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const status = statusConfig[d.status] || { label: d.status, variant: "neutral" };
                return (
                  <tr key={d.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--primary)" }}>{d.id}</span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      {new Date(d.date).toLocaleDateString("bn-BD")}
                    </td>
                    <td style={{ fontWeight: 500 }}>{d.destination}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{d.driverName || "—"}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{d.vehicleReg || "—"}</td>
                    <td>
                      <span className={`badge badge--${status.variant}`}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ gap: "0.25rem", fontSize: "0.8125rem" }}
                        onClick={() => navigate(`/app/transport/deliveries/${d.id}`)}
                      >
                        <Truck size={13} /> বিস্তারিত
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <Package size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো ডেলিভারি পাওয়া যায়নি</p>
                      <p className="empty-state__desc">নতুন ডেলিভারি যোগ করে শুরু করুন।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border-soft)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            মোট {filtered.length}টি ডেলিভারি রেকর্ড
          </div>
        )}
      </div>
    </div>
  );
}
