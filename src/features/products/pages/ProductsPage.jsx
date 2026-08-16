import { useState } from "react";
import { Plus, Search, Edit, Package, X } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

export default function ProductsPage() {
  const { products, addProduct } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [newProd, setNewProd] = useState({ code: "", name: "", unit: "পিস", price: 0, status: "ACTIVE" });

  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || p.status === statusFilter)
  );

  const handleAdd = (e) => {
    e.preventDefault();
    addProduct({ ...newProd, id: `PROD-${Date.now()}`, price: Number(newProd.price) });
    setShowModal(false);
    setNewProd({ code: "", name: "", unit: "পিস", price: 0, status: "ACTIVE" });
    alert("পণ্য সফলভাবে যোগ করা হয়েছে!");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>পণ্য তালিকা</h2>
          <p>আপনার পণ্য ও সেবার তালিকা পরিচালনা করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={17} /> নতুন পণ্য
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="section-card">
        <div className="section-card__header">
          <div className="toolbar" style={{ flex: 1 }}>
            <div className="search-box toolbar__search">
              <span className="search-box__icon"><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="পণ্যের নাম বা কোড দিয়ে খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">সব পণ্য</option>
              <option value="ACTIVE">সক্রিয়</option>
              <option value="INACTIVE">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>কোড</th>
                <th>পণ্যের নাম</th>
                <th>ইউনিট</th>
                <th className="text-right">মূল্য (৳)</th>
                <th>স্ট্যাটাস</th>
                <th style={{ textAlign: "center" }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", background: "var(--surface-soft)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                      {p.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{p.description}</div>}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.unit}</td>
                  <td className="text-right" style={{ fontWeight: 700, color: "var(--primary)" }}>
                    ৳ {p.price.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={`badge badge--${p.status === "ACTIVE" ? "success" : "neutral"}`}>
                      <span className="badge-dot" style={{ background: p.status === "ACTIVE" ? "var(--success)" : "var(--text-muted)" }} />
                      {p.status === "ACTIVE" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      title="এডিট করুন"
                      onClick={() => alert("Edit not implemented in demo")}
                    >
                      <Edit size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <Package size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো পণ্য পাওয়া যায়নি</p>
                      <p className="empty-state__desc">নতুন পণ্য যোগ করে শুরু করুন।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border-soft)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            মোট {filtered.length}টি পণ্য
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal modal--sm">
            <div className="modal__header">
              <h3 className="modal__title">নতুন পণ্য যোগ করুন</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal__body">
                <div className="form-group">
                  <label className="form-label">প্রোডাক্ট কোড <span className="required">*</span></label>
                  <input type="text" className="form-input" placeholder="PROD-001" value={newProd.code} onChange={e => setNewProd({ ...newProd, code: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">পণ্যের নাম <span className="required">*</span></label>
                  <input type="text" className="form-input" placeholder="পণ্যের নাম লিখুন" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} required />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">ইউনিট</label>
                    <input type="text" className="form-input" placeholder="পিস, কেজি, লিটার..." value={newProd.unit} onChange={e => setNewProd({ ...newProd, unit: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">মূল্য (৳) <span className="required">*</span></label>
                    <input type="number" className="form-input" placeholder="0" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} required />
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>বাতিল</button>
                <button type="submit" className="btn btn-primary">পণ্য সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
