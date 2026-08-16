import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, ArrowRight } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/customers.css";

/* ── Helper: format Taka amount ─────────────────────────────── */
function formatBalance(due) {
  const abs = Math.abs(due).toLocaleString("en-IN");
  if (due > 0)  return { label: `৳ ${abs}`,  color: "var(--danger)",  bg: "var(--danger-light)" };
  if (due < 0)  return { label: `৳ ${Math.abs(due).toLocaleString("en-IN")} (অগ্রিম)`, color: "#0369a1", bg: "#f0f9ff" };
  return        { label: "৳ ০",             color: "var(--success)", bg: "var(--success-light)" };
}

/* ── Helper: zero-padded serial ─────────────────────────────── */
function serial(index) {
  return String(index + 1).padStart(2, "0");
}

export default function CustomersListPage() {
  const { customers } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* Extended search: name, shopName, village, phone */
  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      (c.shopName || "").toLowerCase().includes(q) ||
      (c.village || "").toLowerCase().includes(q) ||
      c.phone.includes(q);
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>গ্রাহক ব্যবস্থাপনা</h2>
          <p>আপনার সকল গ্রাহকের তথ্য, ক্রয় ও বকেয়া পরিচালনা করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => navigate("/app/customers/new")}>
            <Plus size={18} /> নতুন গ্রাহক
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────── */}
      <div className="section-card">

        {/* Toolbar */}
        <div className="section-card__header">
          <div className="toolbar" style={{ flex: 1 }}>
            <div className="search-box toolbar__search">
              <span className="search-box__icon"><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="নাম, দোকান, গ্রাম বা ফোন দিয়ে খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">সব গ্রাহক</option>
              <option value="ACTIVE">সক্রিয়</option>
              <option value="INACTIVE">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        {/* ── Desktop / Tablet Table ───────────────────── */}
        <div className="erp-table-wrapper cust-table-wrapper">
          <table className="erp-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}>ক্রমিক নং</th>
                <th>নাম</th>
                <th>দোকানের নাম</th>
                <th>গ্রাম</th>
                <th>ফোন নম্বর</th>
                <th className="text-right">ব্যালেন্স</th>
                <th style={{ width: 120 }}>বিস্তারিত</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cus, idx) => {
                const bal = formatBalance(cus.due);
                return (
                  <tr
                    key={cus.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/app/customers/${cus.id}`)}
                  >
                    {/* Serial */}
                    <td>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        fontFeatureSettings: "'tnum'",
                      }}>
                        {serial(idx)}
                      </span>
                    </td>

                    {/* Name */}
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{cus.name}</div>
                    </td>

                    {/* Dokan er Nam */}
                    <td style={{ color: "var(--text-secondary)" }}>
                      {cus.shopName || <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>

                    {/* Gram */}
                    <td style={{ color: "var(--text-secondary)" }}>
                      {cus.village || <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>

                    {/* Phone */}
                    <td style={{ color: "var(--text-secondary)", fontFeatureSettings: "'tnum'", letterSpacing: "0.01em" }}>
                      {cus.phone}
                    </td>

                    {/* Balance */}
                    <td className="text-right">
                      <span style={{
                        display: "inline-block",
                        padding: "0.2rem 0.625rem",
                        borderRadius: "var(--radius-full)",
                        background: bal.bg,
                        color: bal.color,
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        whiteSpace: "nowrap",
                      }}>
                        {bal.label}
                      </span>
                    </td>

                    {/* Details */}
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ gap: "0.25rem", fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600 }}
                        onClick={() => navigate(`/app/customers/${cus.id}`)}
                      >
                        প্রোফাইল <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <Users size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো গ্রাহক পাওয়া যায়নি</p>
                      <p className="empty-state__desc">
                        {search
                          ? "আপনার সার্চ পরিবর্তন করুন অথবা নতুন গ্রাহক যোগ করুন।"
                          : "প্রথম গ্রাহক যোগ করে শুরু করুন।"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Card List ─────────────────────────── */}
        <div className="cust-mobile-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Users size={40} className="empty-state__icon" />
              <p className="empty-state__title">কোনো গ্রাহক পাওয়া যায়নি</p>
              <p className="empty-state__desc">
                {search
                  ? "আপনার সার্চ পরিবর্তন করুন অথবা নতুন গ্রাহক যোগ করুন।"
                  : "প্রথম গ্রাহক যোগ করে শুরু করুন।"}
              </p>
            </div>
          ) : (
            filtered.map((cus, idx) => {
              const bal = formatBalance(cus.due);
              return (
                <div
                  key={cus.id}
                  className="cust-mobile-card"
                  onClick={() => navigate(`/app/customers/${cus.id}`)}
                >
                  {/* Card header row */}
                  <div className="cust-mobile-card__head">
                    <span className="cust-mobile-card__serial">{serial(idx)}</span>
                    <div className="cust-mobile-card__name-block">
                      <span className="cust-mobile-card__name">{cus.name}</span>
                      {cus.shopName && (
                        <span className="cust-mobile-card__shop">{cus.shopName}</span>
                      )}
                    </div>
                    <span
                      className="cust-mobile-card__balance"
                      style={{ color: bal.color, background: bal.bg }}
                    >
                      {bal.label}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="cust-mobile-card__meta">
                    {cus.village && (
                      <span className="cust-mobile-card__meta-item">
                        <span className="cust-mobile-card__meta-label">গ্রাম:</span> {cus.village}
                      </span>
                    )}
                    <span className="cust-mobile-card__meta-item">
                      <span className="cust-mobile-card__meta-label">ফোন:</span> {cus.phone}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="cust-mobile-card__footer">
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.875rem" }}
                      onClick={e => { e.stopPropagation(); navigate(`/app/customers/${cus.id}`); }}
                    >
                      প্রোফাইল <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div style={{
            padding: "0.875rem 1.5rem",
            borderTop: "1px solid var(--border-soft)",
            fontSize: "0.875rem",
            color: "var(--text-muted)"
          }}>
            মোট {filtered.length} জন গ্রাহক পাওয়া গেছে
          </div>
        )}
      </div>
    </div>
  );
}
