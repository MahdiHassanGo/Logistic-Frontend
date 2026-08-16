import { useState } from "react";
import { Search, RefreshCw, Settings, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialSms = [
  { id: 1, to: "রহিম ট্রেডার্স", phone: "01712345678", ref: "LK-INV-2026-0087", date: "2026-08-12 10:30 AM", status: "DELIVERED", msg: "প্রিয় রহিম ট্রেডার্স, আপনার বকেয়া ৫০০০ টাকা পরিশোধের অনুরোধ করা হচ্ছে।" },
  { id: 2, to: "করিম এন্টারপ্রাইজ", phone: "01812345678", ref: "Payment", date: "2026-08-11 04:15 PM", status: "FAILED", msg: "আপনার পেমেন্ট ২০০০ টাকা গৃহীত হয়েছে। ধন্যবাদ।" },
];

export default function SmsHistoryPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialSms);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const resendSms = (id) => {
    alert("SMS Resent successfully (Mock Simulation)");
    setMessages(messages.map(m => m.id === id ? { ...m, status: "DELIVERED" } : m));
  };

  const filtered = messages.filter(m =>
    (filter === "ALL" || m.status === filter) &&
    (m.to.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search))
  );

  const totalSent = messages.length;
  const delivered = messages.filter(m => m.status === "DELIVERED").length;
  const failed = messages.filter(m => m.status === "FAILED").length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>SMS ইতিহাস</h2>
          <p>গ্রাহকদের কাছে পাঠানো সকল SMS এর রেকর্ড।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline" onClick={() => navigate("/app/settings")}>
            <Settings size={16} /> SMS সেটিংস
          </button>
        </div>
      </div>

      {/* Gateway Status */}
      <div className="erp-card" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", borderLeft: "4px solid var(--success)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 0 4px rgba(34,197,94,0.2)", flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: "2px" }}>SMS গেটওয়ে সংযুক্ত আছে</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>প্রোভাইডার: BulkSMS BD &nbsp;·&nbsp; ব্যালেন্স: ৳ ৩,৪৫০</div>
          </div>
        </div>
        <span className="badge badge--success" style={{ fontSize: "0.875rem" }}>
          <CheckCircle2 size={13} /> Connected
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon--blue"><MessageSquare size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">মোট পাঠানো</div>
            <div className="stat-card__value">১,৪২০</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green"><CheckCircle2 size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">ডেলিভারড</div>
            <div className="stat-card__value text-success">১,৪০৫</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--red"><XCircle size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">ব্যর্থ</div>
            <div className="stat-card__value text-danger">১৫</div>
          </div>
        </div>
      </div>

      {/* SMS Table */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="toolbar" style={{ flex: 1 }}>
            <div className="search-box toolbar__search">
              <span className="search-box__icon"><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="গ্রাহক বা নম্বর খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="DELIVERED">ডেলিভারড</option>
              <option value="FAILED">ব্যর্থ</option>
              <option value="PENDING">পেন্ডিং</option>
            </select>
          </div>
        </div>

        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>গ্রাহক</th>
                <th>ফোন নম্বর</th>
                <th>রেফারেন্স</th>
                <th>তারিখ ও সময়</th>
                <th>মেসেজ</th>
                <th>স্ট্যাটাস</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sms => (
                <tr key={sms.id}>
                  <td style={{ fontWeight: 600 }}>{sms.to}</td>
                  <td style={{ color: "var(--text-secondary)", fontFamily: "monospace", fontSize: "0.875rem" }}>{sms.phone}</td>
                  <td>
                    <span style={{ fontSize: "0.8125rem", background: "var(--surface-soft)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                      {sms.ref}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{sms.date}</td>
                  <td style={{ maxWidth: "200px" }} title={sms.msg}>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      {sms.msg}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge--${sms.status === "DELIVERED" ? "success" : sms.status === "FAILED" ? "danger" : "warning"}`}>
                      {sms.status === "DELIVERED" ? "ডেলিভারড" : sms.status === "FAILED" ? "ব্যর্থ" : "পেন্ডিং"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {sms.status === "FAILED" ? (
                      <button className="btn btn-ghost btn-sm" onClick={() => resendSms(sms.id)}>
                        <RefreshCw size={13} /> পুনরায় পাঠান
                      </button>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
