import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Filter, TrendingUp, Users, CreditCard, AlertCircle } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const mockData = [
  { name: "শনি", sales: 4000, collection: 2400 },
  { name: "রবি", sales: 3000, collection: 1398 },
  { name: "সোম", sales: 2000, collection: 9800 },
  { name: "মঙ্গল", sales: 2780, collection: 3908 },
  { name: "বুধ", sales: 1890, collection: 4800 },
  { name: "বৃহঃ", sales: 2390, collection: 3800 },
  { name: "শুক্র", sales: 3490, collection: 4300 },
];

export default function ReportsPage() {
  const { customers, invoices, payments } = useAppData();
  const [filter, setFilter] = useState("Weekly");

  const totalSales = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCollection = payments.reduce((acc, pay) => acc + pay.amount, 0);
  const outstandingDue = customers.reduce((acc, cus) => acc + cus.due, 0);
  const totalCustomers = customers.length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ফাইন্যান্সিয়াল রিপোর্টস</h2>
          <p>বিক্রয়, কালেকশন ও বকেয়ার বিশ্লেষণ দেখুন।</p>
        </div>
        <div className="page-header__actions">
          <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="Today">আজকে</option>
            <option value="Weekly">এই সপ্তাহ</option>
            <option value="Monthly">এই মাস</option>
            <option value="Yearly">এই বছর</option>
            <option value="Custom">কাস্টম ডেট</option>
          </select>
          <button className="btn btn-primary" onClick={() => alert("Export simulated")}>
            <Download size={17} /> এক্সপোর্ট
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      {filter === "Custom" && (
        <div className="erp-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label className="form-label">শুরুর তারিখ</label>
              <input type="date" className="form-input" />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
              <label className="form-label">শেষের তারিখ</label>
              <input type="date" className="form-input" />
            </div>
            <button className="btn btn-primary" style={{ flexShrink: 0 }}>এপ্লাই</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon--blue"><TrendingUp size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">মোট বিক্রয়</div>
            <div className="stat-card__value text-primary">৳ {totalSales.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green"><CreditCard size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">মোট কালেকশন</div>
            <div className="stat-card__value text-success">৳ {totalCollection.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--red"><AlertCircle size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">সর্বমোট বকেয়া</div>
            <div className="stat-card__value text-danger">৳ {outstandingDue.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--cyan"><Users size={22} /></div>
          <div className="stat-card__info">
            <div className="stat-card__label">গ্রাহক সংখ্যা</div>
            <div className="stat-card__value">{totalCustomers} জন</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="section-card">
        <div className="section-card__header">
          <h3 className="section-card__title">বিক্রয় ও কালেকশন ওভারভিউ</h3>
          <span className="badge badge--neutral">{filter}</span>
        </div>
        <div className="section-card__body">
          <div style={{ height: 360, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "rgba(15,23,42,0.04)" }}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)", fontSize: 14 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 14, paddingTop: 16 }} />
                <Bar dataKey="sales" name="বিক্রয়" fill="#2563eb" radius={[5, 5, 0, 0]} maxBarSize={40} />
                <Bar dataKey="collection" name="কালেকশন" fill="#22c55e" radius={[5, 5, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
