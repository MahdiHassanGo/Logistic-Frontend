import { useParams, useNavigate } from "react-router-dom";
import { Plus, CreditCard, FileText, MessageSquare, ArrowLeft, Printer, Package } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/customers.css";

/* ── Category pill config ───────────────────────────────────────────── */
const PILL_STYLE = {
  "রড":      { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  "সিমেন্ট": { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  "ইট":      { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  "বালি":    { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "পাথর":   { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
  "খোয়া":   { bg: "#FDF4FF", color: "#86198F", border: "#F0ABFC" },
  "টিন":     { bg: "#F0FDF4", color: "#065F46", border: "#A7F3D0" },
  "পাইপ":   { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
  "তার":    { bg: "#F8FAFC", color: "#475569", border: "#CBD5E1" },
};

function CategoryPill({ category }) {
  const style = PILL_STYLE[category] || { bg: "var(--surface-soft)", color: "var(--text-muted)", border: "var(--border)" };
  return (
    <span style={{
      display: "inline-block",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      padding: "2px 7px",
      borderRadius: "5px",
      whiteSpace: "nowrap",
      flexShrink: 0,
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
    }}>
      {category || "অন্যান্য"}
    </span>
  );
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function CustomerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, invoices } = useAppData();

  const customer    = customers.find(c => c.id === id);
  const cusInvoices = (invoices || [])
    .filter(inv => inv.customerId === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalSales = cusInvoices.reduce((s, inv) => s + (inv.amount || 0), 0);
  const totalPaid  = cusInvoices.reduce((s, inv) => s + (inv.paid  || 0), 0);
  const totalDue   = cusInvoices.reduce((s, inv) => s + (inv.due   || 0), 0);

  if (!customer) {
    return (
      <div style={{ maxWidth: 480, margin: "4rem auto", textAlign: "center" }}>
        <div className="empty-state">
          <Package size={40} className="empty-state__icon" />
          <p className="empty-state__title">গ্রাহক পাওয়া যায়নি</p>
          <p className="empty-state__desc">এই গ্রাহকের তথ্য পাওয়া যাচ্ছে না।</p>
          <button className="btn btn-outline" style={{ marginTop: "1rem" }} onClick={() => navigate("/app/customers")}>
            <ArrowLeft size={16} /> গ্রাহক তালিকায় ফিরুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-page">

      {/* ══ BACK + ACTION BAR ══════════════════════════════════════════ */}
      <div className="cp-action-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/app/customers")} style={{ gap: "0.375rem" }}>
          <ArrowLeft size={16} /> গ্রাহক তালিকা
        </button>
        <div className="cp-action-bar__right">
          <button className="btn btn-outline btn-sm" onClick={() => alert("SMS sent (Frontend Simulation)")}>
            <MessageSquare size={15} /> SMS
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/app/payments/new?customerId=${customer.id}`)}>
            <CreditCard size={15} /> পেমেন্ট গ্রহণ
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/app/purchases/new?customer=${customer.id}`)}>
            <Plus size={15} /> নতুন চালান
          </button>
        </div>
      </div>

      {/* ══ KHATA HEADER ══════════════════════════════════════════════ */}
      <div className="cp-header">
        <h1 className="cp-customer-name">{customer.name}</h1>
        {customer.shopName && (
          <div className="cp-shop-row">
            <span className="cp-shop-line" />
            <span className="cp-shop-name">{customer.shopName}</span>
            <span className="cp-shop-line" />
          </div>
        )}
        <p className="cp-meta-row">
          {customer.phone}
          {customer.village && <> &nbsp;·&nbsp; {customer.village}</>}
          {customer.address && <> &nbsp;·&nbsp; {customer.address}</>}
        </p>
        <div className="cp-khata-rule" />
      </div>

      {/* ══ PRINT TOOLBAR ═════════════════════════════════════════════ */}
      <div className="cp-toolbar">
        <button className="cp-btn-print" onClick={() => window.print()}>
          <Printer size={13} /> প্রিন্ট করুন
        </button>
      </div>

      {/* ══ SUMMARY STRIP ═════════════════════════════════════════════ */}
      <div className="cp-summary">
        <div className="cp-summary-card">
          <div className="cp-summary-label">মোট জমা</div>
          <div className="cp-summary-value cp-summary-value--green">
            ৳{totalPaid.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="cp-summary-card">
          <div className="cp-summary-label">মোট খরচ</div>
          <div className="cp-summary-value cp-summary-value--ink">
            ৳{totalSales.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="cp-summary-card">
          <div className="cp-summary-label">মোট বাকি</div>
          <div className={`cp-summary-value ${totalDue > 0 ? "cp-summary-value--red" : "cp-summary-value--green"}`}>
            ৳{totalDue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* ══ LEDGER CARD ═══════════════════════════════════════════════ */}
      <div className="cp-ledger-card">
        {/* Top bar */}
        <div className="cp-ledger-topbar">
          <span className="cp-ledger-topbar-title">লেনদেনের ইতিহাস</span>
          <span className="cp-tx-count">মোট {cusInvoices.length}টি লেনদেন</span>
        </div>

        {/* Table */}
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th>তারিখ</th>
                <th>বিবরণ</th>
                <th className="cp-th-r">জমা</th>
                <th className="cp-th-r">খরচ</th>
                <th className="cp-th-r cp-th-due">বাকি</th>
              </tr>
            </thead>
            <tbody>
              {cusInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state" style={{ padding: "2.5rem" }}>
                      <FileText size={36} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো লেনদেন নেই</p>
                      <p className="empty-state__desc">এই গ্রাহকের কোনো চালান তৈরি হয়নি।</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {cusInvoices.map(inv => (
                    <tr
                      key={inv.id}
                      className="cp-data-row"
                      onClick={() => navigate(`/app/invoices/${inv.id}`)}
                    >
                      {/* Date */}
                      <td className="cp-td-date">
                        {new Date(inv.date).toLocaleDateString("bn-BD")}
                        <div className="cp-invoice-id">{inv.id}</div>
                      </td>

                      {/* Description */}
                      <td className="cp-td-desc">
                        {inv.items && inv.items.length > 0 ? (
                          inv.items.map((it, i) => (
                            <div key={i} className="cp-desc-row">
                              <CategoryPill category={it.category} />
                              <span className="cp-desc-text">{it.product}</span>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>

                      {/* জমা */}
                      <td className="cp-td-r cp-amt-paid">
                        ৳{(inv.paid || 0).toLocaleString("en-IN")}
                      </td>

                      {/* খরচ */}
                      <td className="cp-td-r cp-amt-cost">
                        ৳{(inv.amount || 0).toLocaleString("en-IN")}
                      </td>

                      {/* বাকি */}
                      <td className="cp-td-due-cell" onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                          <span className={`cp-due-chip ${inv.due <= 0 ? "cp-due-chip--paid" : ""}`}>
                            ৳{(inv.due || 0).toLocaleString("en-IN")}
                          </span>
                          <button
                            className="btn btn-ghost btn-icon"
                            style={{ width: 28, height: 28, color: "var(--primary)" }}
                            title="চালান দেখুন"
                            onClick={() => navigate(`/app/invoices/${inv.id}`)}
                          >
                            <FileText size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Totals row */}
                  <tr className="cp-row-total">
                    <td colSpan="2" className="cp-total-label">সর্বমোট</td>
                    <td className="cp-td-r cp-amt-paid">৳{totalPaid.toLocaleString("en-IN")}</td>
                    <td className="cp-td-r cp-amt-cost">৳{totalSales.toLocaleString("en-IN")}</td>
                    <td className="cp-td-due-cell">
                      <span className={`cp-due-chip cp-due-chip--lg ${totalDue <= 0 ? "cp-due-chip--paid" : ""}`}>
                        ৳{totalDue.toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ FOOTER ════════════════════════════════════════════════════ */}
      <div className="cp-footer">
        {customer.shopName && <>{customer.shopName} &nbsp;•&nbsp;</>}
        রড, সিমেন্ট ও নির্মাণ সামগ্রী &nbsp;•&nbsp; হিসাব ব্যবস্থাপনা সিস্টেম
      </div>

    </div>
  );
}
