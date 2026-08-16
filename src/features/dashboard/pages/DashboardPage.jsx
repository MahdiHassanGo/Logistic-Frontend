import { Link, useNavigate } from "react-router-dom";
import {
  Users, TrendingUp, CreditCard, AlertCircle,
  ShoppingCart, ArrowRight, Package, HardHat,
  Receipt, Wallet
} from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/dashboard.css";

/* ── helpers ──────────────────────────────────────────────────── */
function formatBalance(due) {
  const abs = Math.abs(due).toLocaleString("en-IN");
  if (due > 0) return { label: `৳ ${abs}`,  color: "var(--danger)",  bg: "var(--danger-light)" };
  if (due < 0) return { label: `৳ ${abs} অগ্রিম`, color: "#0369a1", bg: "#f0f9ff" };
  return          { label: "৳ ০",            color: "var(--success)", bg: "var(--success-light)" };
}

/* ── quick actions data ───────────────────────────────────────── */
const QUICK_ACTIONS = [
  {
    label: "নতুন চালান",
    desc: "মাল বিক্রির নতুন চালান তৈরি",
    icon: Receipt,
    accent: "#2563eb",
    accentBg: "#eff6ff",
    to: "/app/purchases/new",
  },
  {
    label: "নতুন গ্রাহক",
    desc: "নতুন ক্রেতার তথ্য যোগ করুন",
    icon: Users,
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    to: "/app/customers/new",
  },
  {
    label: "পেমেন্ট গ্রহণ",
    desc: "গ্রাহকের বকেয়া সংগ্রহ করুন",
    icon: Wallet,
    accent: "#ea580c",
    accentBg: "#fff7ed",
    to: "/app/payments/new",
  },
];

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { customers, invoices, payments } = useAppData();
  const navigate = useNavigate();

  /* ── KPI computations ── */
  const totalCustomers   = customers.length;
  const activeCustomers  = customers.filter(c => c.status === "ACTIVE").length;
  const totalSales       = invoices.reduce((s, inv) => s + (inv.amount || 0), 0);
  const totalDue         = customers.reduce((s, c) => s + (c.due > 0 ? c.due : 0), 0);
  const totalCollection  = invoices.reduce((s, inv) => s + (inv.paid  || 0), 0);

  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const recentCustomers = [...customers]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 6);

  return (
    <div className="db-page">

      {/* ══ WELCOME BANNER ════════════════════════════════════════ */}
      <div className="db-banner">
        {/* Decorative circles */}
        <span className="db-banner__circle db-banner__circle--1" />
        <span className="db-banner__circle db-banner__circle--2" />

        <div className="db-banner__left">
          <div className="db-banner__icon-wrap">
            <HardHat size={22} />
          </div>
          <div>
            <h2 className="db-banner__title">স্বাগতম, অ্যাডমিন</h2>
            <p className="db-banner__sub">
              রড, সিমেন্ট ও নির্মাণ সামগ্রী — ব্যবসার সার্বিক চিত্র দেখুন
            </p>
          </div>
        </div>

        <div className="db-banner__right">
          <div className="db-banner__date-pill">
            <span className="db-banner__date-dot" />
            {today}
          </div>
          <button
            className="db-banner__cta"
            onClick={() => navigate("/app/purchases/new")}
          >
            <ShoppingCart size={16} /> নতুন চালান
          </button>
        </div>
      </div>

      {/* ══ KPI STRIP ════════════════════════════════════════════ */}
      <div className="db-kpi-grid">

        <div className="db-kpi-card db-kpi-card--blue">
          <div className="db-kpi-card__accent" />
          <div className="db-kpi-card__icon-wrap">
            <Users size={20} />
          </div>
          <div className="db-kpi-card__body">
            <div className="db-kpi-card__label">সক্রিয় গ্রাহক</div>
            <div className="db-kpi-card__value">{activeCustomers}</div>
            <div className="db-kpi-card__sub">মোট {totalCustomers} জন নিবন্ধিত</div>
          </div>
        </div>

        <div className="db-kpi-card db-kpi-card--indigo">
          <div className="db-kpi-card__accent" />
          <div className="db-kpi-card__icon-wrap">
            <TrendingUp size={20} />
          </div>
          <div className="db-kpi-card__body">
            <div className="db-kpi-card__label">মোট বিক্রয়</div>
            <div className="db-kpi-card__value">৳ {totalSales.toLocaleString("en-IN")}</div>
            <div className="db-kpi-card__sub">সর্বমোট চালান মূল্য</div>
          </div>
        </div>

        <div className="db-kpi-card db-kpi-card--green">
          <div className="db-kpi-card__accent" />
          <div className="db-kpi-card__icon-wrap">
            <CreditCard size={20} />
          </div>
          <div className="db-kpi-card__body">
            <div className="db-kpi-card__label">মোট জমা</div>
            <div className="db-kpi-card__value">৳ {totalCollection.toLocaleString("en-IN")}</div>
            <div className="db-kpi-card__sub">গৃহীত মোট পেমেন্ট</div>
          </div>
        </div>

        <div className="db-kpi-card db-kpi-card--red">
          <div className="db-kpi-card__accent" />
          <div className="db-kpi-card__icon-wrap">
            <AlertCircle size={20} />
          </div>
          <div className="db-kpi-card__body">
            <div className="db-kpi-card__label">মোট বকেয়া</div>
            <div className="db-kpi-card__value db-kpi-card__value--red">
              ৳ {totalDue.toLocaleString("en-IN")}
            </div>
            <div className="db-kpi-card__sub">আদায়যোগ্য বকেয়া</div>
          </div>
        </div>

      </div>

      {/* ══ QUICK ACTIONS ════════════════════════════════════════ */}
      <div className="db-section-label">দ্রুত কার্যক্রম</div>
      <div className="db-qa-grid">
        {QUICK_ACTIONS.map(qa => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              className="db-qa-card"
              onClick={() => navigate(qa.to)}
            >
              <div className="db-qa-card__left">
                <div className="db-qa-card__icon" style={{ background: qa.accentBg, color: qa.accent }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="db-qa-card__label">{qa.label}</div>
                  <div className="db-qa-card__desc">{qa.desc}</div>
                </div>
              </div>
              <ArrowRight size={17} className="db-qa-card__arrow" />
            </button>
          );
        })}
      </div>

      {/* ══ RECENT CUSTOMERS ══════════════════════════════════════ */}
      <div className="db-table-card">
        <div className="db-table-card__head">
          <div className="db-table-card__head-left">
            <Package size={17} className="db-table-card__head-icon" />
            <span className="db-table-card__head-title">সাম্প্রতিক গ্রাহকসমূহ</span>
            <span className="db-table-card__head-count">{customers.length} জন</span>
          </div>
          <Link to="/app/customers" className="db-table-card__see-all">
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>নাম ও দোকান</th>
                <th>গ্রাম / এলাকা</th>
                <th>ফোন</th>
                <th className="db-th-r">ব্যালেন্স</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state" style={{ padding: "2rem" }}>
                      <Users size={36} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো গ্রাহক নেই</p>
                      <p className="empty-state__desc">প্রথম গ্রাহক যোগ করুন</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentCustomers.map((cus, idx) => {
                  const bal = formatBalance(cus.due);
                  return (
                    <tr
                      key={cus.id}
                      className="db-table__row"
                      onClick={() => navigate(`/app/customers/${cus.id}`)}
                    >
                      <td>
                        <span className="db-serial">{String(idx + 1).padStart(2, "0")}</span>
                      </td>
                      <td>
                        <div className="db-name">{cus.name}</div>
                        {cus.shopName && <div className="db-shop">{cus.shopName}</div>}
                      </td>
                      <td className="db-muted">{cus.village || "—"}</td>
                      <td className="db-muted">{cus.phone}</td>
                      <td className="db-th-r">
                        <span className="db-bal-chip" style={{ color: bal.color, background: bal.bg }}>
                          {bal.label}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <Link
                          to={`/app/customers/${cus.id}`}
                          className="db-profile-btn"
                        >
                          প্রোফাইল <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
