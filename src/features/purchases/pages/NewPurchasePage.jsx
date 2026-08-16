import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft, User, Package, DollarSign, UserPlus, X, Search } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/purchases.css";

/* ── Constants ──────────────────────────────────────────────────────── */
const CATEGORIES = ["রড", "সিমেন্ট", "ইট", "বালি", "পাথর", "খোয়া", "টিন", "পাইপ", "তার", "অন্যান্য"];

const ROD_BRANDS   = ["BSRM", "KSRM", "GPH", "AKS", "RSRM"];
const ROD_SIZES    = ["৮ মিমি", "১০ মিমি", "১২ মিমি", "১৬ মিমি", "২০ মিমি", "২৫ মিমি", "৩২ মিমি"];
const ROD_UNITS    = ["কেজি", "টন"];

const CEMENT_BRANDS    = ["Crown Cement", "Shah Cement", "Seven Rings Cement", "Fresh Cement", "Bashundhara Cement", "Premier Cement"];
const CEMENT_BAG_SIZES = ["৫০ কেজি", "২৫ কেজি"];

const BRICK_TYPES  = ["১নং ইট", "২নং ইট"];
const SAND_TYPES   = ["মোটা বালি", "মাঝারি বালি", "সিলেট বালি"];
const STONE_TYPES  = ["পাথর (১ ইঞ্চি)", "পাথর (¾ ইঞ্চি)", "পাথর (½ ইঞ্চি)"];
const KHOWA_TYPES  = ["খোয়া (ভাঙা ইট)"];
const TIN_TYPES    = ["জিআই শীট", "রঙিন টিন", "গ্যালভানাইজড টিন"];
const PIPE_TYPES   = ["পিভিসি পাইপ", "জিআই পাইপ", "এইচডিপিই পাইপ"];
const WIRE_TYPES   = ["বাইন্ডিং তার", "ইলেকট্রিক তার (১.৫ মিমি)", "ইলেকট্রিক তার (২.৫ মিমি)"];

/* Default price hints per category */
const DEFAULT_PRICE = {
  "রড": 105, "সিমেন্ট": 570, "ইট": 14, "বালি": 65,
  "পাথর": 95, "খোয়া": 40, "টিন": 850, "পাইপ": 320, "তার": 180, "অন্যান্য": 0
};

/* Build the human-readable product description string */
function buildDescription(row) {
  const { category, brand, size, bagSize, productName, quantity, unit, unitPrice } = row;
  const rate = `৳${Number(unitPrice).toLocaleString("en-IN")}`;

  if (category === "রড") {
    const b = brand || "—", s = size || "—", q = Number(quantity).toLocaleString("en-IN"), u = unit || "কেজি";
    return `${b} রড — ${s} — ${q} ${u} × ${rate}`;
  }
  if (category === "সিমেন্ট") {
    const b = brand || "—", bs = bagSize || "৫০ কেজি", q = Number(quantity).toLocaleString("en-IN");
    return `${b} — ${bs} — ${q} ব্যাগ × ${rate}`;
  }
  const name = productName || category;
  const q    = Number(quantity).toLocaleString("en-IN");
  const u    = unit || "পিস";
  return `${name} — ${q} ${u} × ${rate}`;
}

/* Build the blank row template */
function blankRow() {
  return {
    id: Date.now() + Math.random(),
    category: "রড",
    brand: "BSRM",
    size: "১২ মিমি",
    bagSize: "৫০ কেজি",
    productName: "",
    quantity: 1,
    unit: "কেজি",
    unitPrice: 105,
    discount: 0,
  };
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function NewPurchasePage() {
  const [searchParams] = useSearchParams();
  const paramCustomerId = searchParams.get("customer");
  const { customers, addPurchase, addInvoice, addCustomer } = useAppData();
  const navigate = useNavigate();

  /* ─ Customer mode: "select" | "new" ─ */
  const preselected = customers.find(c => c.id === paramCustomerId) || null;
  const [customerMode, setCustomerMode]         = useState(preselected ? "locked" : "select");
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselected?.id || "");
  const [custSearch, setCustSearch]             = useState("");
  const [newCust, setNewCust]                   = useState({ name: "", phone: "", shopName: "", address: "", village: "" });

  /* resolved customer object for totals preview */
  const selectedCustomer = customerMode === "locked"
    ? preselected
    : customers.find(c => c.id === selectedCustomerId) || null;

  const [items, setItems]           = useState([blankRow()]);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [discountTotal, setDiscountTotal]   = useState(0);
  const [notes, setNotes]           = useState("");

  /* ─ Item helpers ─ */
  const addItem = () => setItems(prev => [...prev, blankRow()]);

  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(r => r.id !== id));
  };

  const updateItem = (id, patch) =>
    setItems(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...patch };

      /* Auto-set sensible defaults when category changes */
      if (patch.category) {
        updated.brand       = patch.category === "রড"      ? "BSRM"      : (patch.category === "সিমেন্ট" ? "Crown Cement" : "");
        updated.size        = patch.category === "রড"      ? "১২ মিমি"   : "";
        updated.bagSize     = patch.category === "সিমেন্ট" ? "৫০ কেজি"  : "";
        updated.productName = "";
        updated.unit        = patch.category === "রড"      ? "কেজি"      :
                              patch.category === "সিমেন্ট" ? "ব্যাগ"     :
                              patch.category === "ইট"      ? "পিস"       : "CFT";
        updated.unitPrice   = DEFAULT_PRICE[patch.category] ?? 0;
        updated.quantity    = 1;
      }
      return updated;
    }));

  /* ─ Totals ─ */
  const subtotal = useMemo(() =>
    items.reduce((sum, r) => sum + (Number(r.quantity) * Number(r.unitPrice)) - Number(r.discount), 0),
    [items]
  );
  const previousDue       = selectedCustomer ? (selectedCustomer.due || 0) : 0;
  const grandTotal        = subtotal - Number(discountTotal);
  const currentDuePreview = previousDue + grandTotal - Number(receivedAmount);

  /* ─ Submit ─ */
  const handleSubmit = (e) => {
    e.preventDefault();

    let activeCustomer = selectedCustomer;

    /* ── New customer mode: create & register first ── */
    if (customerMode === "new") {
      if (!newCust.name.trim() || !newCust.phone.trim()) {
        alert("নতুন গ্রাহকের নাম ও ফোন নম্বর আবশ্যক।");
        return;
      }
      const lastId  = customers.length > 0 ? customers[customers.length - 1].id : "CUS-000";
      const nextNum = parseInt(lastId.replace("CUS-", "")) + 1;
      activeCustomer = {
        id:           `CUS-${String(nextNum).padStart(3, "0")}`,
        name:         newCust.name.trim(),
        phone:        newCust.phone.trim(),
        shopName:     newCust.shopName.trim(),
        businessName: newCust.shopName.trim(),
        village:      newCust.village.trim(),
        address:      newCust.address.trim(),
        due:          0,
        status:       "ACTIVE",
      };
      addCustomer(activeCustomer);
    }

    if (!activeCustomer) { alert("গ্রাহক নির্বাচন করুন।"); return; }

    const builtItems = items.map(r => ({ ...r, product: buildDescription(r) }));

    const newInvoice = {
      id:         `DK-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: activeCustomer.id,
      date:       new Date().toISOString().split("T")[0],
      amount:     grandTotal,
      paid:       Number(receivedAmount),
      due:        grandTotal - Number(receivedAmount),
      status:     Number(receivedAmount) >= grandTotal ? "PAID" : "UNPAID",
      items:      builtItems,
      notes,
    };

    addInvoice(newInvoice);
    addPurchase({ ...newInvoice });

    alert("চালান সফলভাবে সংরক্ষিত হয়েছে!");
    navigate(`/app/invoices/${newInvoice.id}`);
  };

  /* ── Render helpers ─ */
  const renderCategoryOptions = (category) => {
    switch (category) {
      case "ইট":   return BRICK_TYPES;
      case "বালি": return SAND_TYPES;
      case "পাথর": return STONE_TYPES;
      case "খোয়া": return KHOWA_TYPES;
      case "টিন":  return TIN_TYPES;
      case "পাইপ": return PIPE_TYPES;
      case "তার":  return WIRE_TYPES;
      default:     return [];
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>নতুন বিক্রয় / চালান</h2>
          <p>নির্মাণ সামগ্রী বিক্রির নতুন চালান তৈরি করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> ফিরে যান
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Customer Section ──────────────────────────────── */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">

            {/* Section title + mode toggle buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              <div className="form-section__title" style={{ marginBottom: 0 }}>
                <User size={15} /> গ্রাহক নির্বাচন
              </div>
              {customerMode !== "locked" && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${customerMode === "select" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setCustomerMode("select")}
                  >
                    <User size={14} /> বিদ্যমান গ্রাহক
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${customerMode === "new" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setCustomerMode("new")}
                  >
                    <UserPlus size={14} /> নতুন গ্রাহক
                  </button>
                </div>
              )}
            </div>

            {/* ── LOCKED: came from customer profile ── */}
            {customerMode === "locked" && preselected && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{preselected.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {preselected.shopName && <>{preselected.shopName} &nbsp;·&nbsp;</>}
                    {preselected.phone}
                    {preselected.address && <> &nbsp;·&nbsp; {preselected.address}</>}
                  </div>
                </div>
                <div style={{
                  background: preselected.due > 0 ? "var(--danger-light)" : "var(--success-light)",
                  border: `1px solid ${preselected.due > 0 ? "#fecaca" : "#bbf7d0"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1.25rem",
                  minWidth: 160, textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>পূর্বের বকেয়া</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: preselected.due > 0 ? "var(--danger)" : "var(--success)" }}>
                    ৳ {(preselected.due || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  title="গ্রাহক পরিবর্তন করুন"
                  onClick={() => { setCustomerMode("select"); setSelectedCustomerId(""); }}
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* ── SELECT: pick from existing list ── */}
            {customerMode === "select" && (
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">গ্রাহক বেছে নিন <span className="required">*</span></label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                      <Search size={15} />
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: "2.25rem" }}
                      placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                      value={custSearch}
                      onChange={e => { setCustSearch(e.target.value); setSelectedCustomerId(""); }}
                    />
                  </div>
                  {custSearch && (
                    <div style={{
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface)",
                      boxShadow: "var(--shadow-md)",
                      maxHeight: 220,
                      overflowY: "auto",
                      marginTop: 4,
                      zIndex: 10,
                      position: "relative"
                    }}>
                      {customers
                        .filter(c =>
                          c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
                          c.phone.includes(custSearch) ||
                          (c.shopName || "").toLowerCase().includes(custSearch.toLowerCase())
                        )
                        .map(c => (
                          <div
                            key={c.id}
                            style={{
                              padding: "0.625rem 1rem",
                              cursor: "pointer",
                              borderBottom: "1px solid var(--border-soft)",
                              background: selectedCustomerId === c.id ? "var(--primary-light)" : "transparent",
                            }}
                            onClick={() => { setSelectedCustomerId(c.id); setCustSearch(c.name); }}
                            onMouseOver={e => e.currentTarget.style.background = "var(--surface-soft)"}
                            onMouseOut={e => e.currentTarget.style.background = selectedCustomerId === c.id ? "var(--primary-light)" : "transparent"}
                          >
                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                              {c.shopName && <>{c.shopName} · </>}{c.phone}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      background: selectedCustomer.due > 0 ? "var(--danger-light)" : "var(--success-light)",
                      border: `1px solid ${selectedCustomer.due > 0 ? "#fecaca" : "#bbf7d0"}`,
                      borderRadius: "var(--radius-md)",
                      padding: "0.875rem 1.25rem",
                      width: "100%"
                    }}>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>পূর্বের বকেয়া</div>
                      <div style={{ fontSize: "1.125rem", fontWeight: 700, color: selectedCustomer.due > 0 ? "var(--danger)" : "var(--success)" }}>
                        ৳ {previousDue.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── NEW CUSTOMER inline form ── */}
            {customerMode === "new" && (
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">গ্রাহকের নাম <span className="required">*</span></label>
                  <input type="text" className="form-input" placeholder="পূর্ণ নাম" value={newCust.name} onChange={e => setNewCust(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">ফোন নম্বর <span className="required">*</span></label>
                  <input type="tel" className="form-input" placeholder="০১XXXXXXXXX" value={newCust.phone} onChange={e => setNewCust(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">দোকানের নাম</label>
                  <input type="text" className="form-input" placeholder="ব্যবসা প্রতিষ্ঠানের নাম" value={newCust.shopName} onChange={e => setNewCust(p => ({ ...p, shopName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">গ্রাম / এলাকা</label>
                  <input type="text" className="form-input" placeholder="গ্রাম বা এলাকার নাম" value={newCust.village} onChange={e => setNewCust(p => ({ ...p, village: e.target.value }))} />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">ঠিকানা</label>
                  <input type="text" className="form-input" placeholder="বিস্তারিত ঠিকানা" value={newCust.address} onChange={e => setNewCust(p => ({ ...p, address: e.target.value }))} />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Product Lines ────────────────────────────────── */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="section-card__header">
            <h3 className="section-card__title">
              <Package size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
              পণ্য তালিকা
            </h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={addItem}>
              <Plus size={15} /> পণ্য যোগ করুন
            </button>
          </div>

          <div style={{ padding: "0 1.5rem 1.5rem" }}>
            {items.map((row, idx) => (
              <ProductRow
                key={row.id}
                row={row}
                index={idx}
                onUpdate={patch => updateItem(row.id, patch)}
                onRemove={() => removeItem(row.id)}
                canRemove={items.length > 1}
                renderCategoryOptions={renderCategoryOptions}
              />
            ))}
          </div>

          {/* Preview table */}
          {items.some(r => r.quantity > 0 && r.unitPrice > 0) && (
            <div className="erp-table-wrapper" style={{ margin: "0 1.5rem 1.5rem", borderRadius: "var(--radius-md)" }}>
              <table className="erp-table" style={{ fontSize: "0.875rem" }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>বিবরণ</th>
                    <th className="text-right">পরিমাণ</th>
                    <th className="text-right">দর (৳)</th>
                    <th className="text-right">মোট (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, idx) => {
                    const lineTotal = (Number(row.quantity) * Number(row.unitPrice)) - Number(row.discount);
                    return (
                      <tr key={row.id}>
                        <td style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{buildDescription(row)}</td>
                        <td className="text-right">{Number(row.quantity).toLocaleString("en-IN")} {row.unit}</td>
                        <td className="text-right">৳ {Number(row.unitPrice).toLocaleString("en-IN")}</td>
                        <td className="text-right" style={{ fontWeight: 700 }}>৳ {lineTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Notes + Summary ──────────────────────────────── */}
        <div className="purchase-page-grid">
          <div className="section-card">
            <div className="form-section">
              <div className="form-section__title">নোট / মন্তব্য</div>
              <div className="form-group">
                <textarea
                  className="form-input"
                  rows="5"
                  placeholder="ডেলিভারি নির্দেশনা বা চালান সম্পর্কিত মন্তব্য..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="purchase-summary-card">
            <div className="purchase-summary-card__header">
              <h4><DollarSign size={15} style={{ display: "inline", marginRight: "0.375rem" }} />আর্থিক সারসংক্ষেপ</h4>
            </div>
            <div className="purchase-summary-card__body">
              <div className="summary-row">
                <span style={{ color: "var(--text-muted)" }}>সাবটোটাল</span>
                <span style={{ fontWeight: 600 }}>৳ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span style={{ color: "var(--text-muted)" }}>পূর্বের বকেয়া</span>
                <span style={{ color: "var(--danger)", fontWeight: 600 }}>৳ {previousDue.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row" style={{ alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>অতিরিক্ত ছাড় (৳)</span>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: "130px", height: "40px" }}
                  value={discountTotal}
                  onChange={e => setDiscountTotal(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className="summary-row summary-row--total">
                <span>গ্র্যান্ড টোটাল</span>
                <span>৳ {grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row" style={{ alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>জমা (নগদ/ব্যাংক)</span>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: "130px", height: "40px", borderColor: "var(--success)" }}
                  value={receivedAmount}
                  onChange={e => setReceivedAmount(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className={`summary-row ${currentDuePreview > 0 ? "summary-row--due" : "summary-row--paid"}`} style={{ fontWeight: 700, fontSize: "1.0625rem" }}>
                <span>বর্তমান বকেয়া</span>
                <span>৳ {currentDuePreview.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", gap: "1rem" }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>বাতিল</button>
          <button type="submit" className="btn btn-primary">
            <Save size={17} /> চালান সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ProductRow — smart input panel per category
══════════════════════════════════════════════════════════════════════ */
function ProductRow({ row, index, onUpdate, onRemove, canRemove, renderCategoryOptions }) {
  const lineTotal = (Number(row.quantity) * Number(row.unitPrice)) - Number(row.discount);
  const genericOptions = renderCategoryOptions(row.category);

  return (
    <div className="product-row-card">
      {/* Row Header */}
      <div className="product-row-card__head">
        <span className="product-row-card__num">{String(index + 1).padStart(2, "0")}</span>
        <div className="form-group" style={{ flex: "0 0 160px" }}>
          <label className="form-label">বিভাগ</label>
          <select className="form-input" value={row.category} onChange={e => onUpdate({ category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* ── রড fields ─ */}
        {row.category === "রড" && <>
          <div className="form-group" style={{ flex: "0 0 150px" }}>
            <label className="form-label">ব্র্যান্ড</label>
            <select className="form-input" value={row.brand} onChange={e => onUpdate({ brand: e.target.value })}>
              {ROD_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: "0 0 130px" }}>
            <label className="form-label">সাইজ</label>
            <select className="form-input" value={row.size} onChange={e => onUpdate({ size: e.target.value })}>
              {ROD_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: "0 0 80px" }}>
            <label className="form-label">ইউনিট</label>
            <select className="form-input" value={row.unit} onChange={e => onUpdate({ unit: e.target.value })}>
              {ROD_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </>}

        {/* ── সিমেন্ট fields ─ */}
        {row.category === "সিমেন্ট" && <>
          <div className="form-group" style={{ flex: "0 0 200px" }}>
            <label className="form-label">ব্র্যান্ড</label>
            <select className="form-input" value={row.brand} onChange={e => onUpdate({ brand: e.target.value })}>
              {CEMENT_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: "0 0 120px" }}>
            <label className="form-label">ব্যাগ সাইজ</label>
            <select className="form-input" value={row.bagSize} onChange={e => onUpdate({ bagSize: e.target.value })}>
              {CEMENT_BAG_SIZES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </>}

        {/* ── Generic category (ইট / বালি / পাথর / খোয়া / টিন / পাইপ / তার / অন্যান্য) ─ */}
        {!["রড", "সিমেন্ট"].includes(row.category) && (
          <>
            {genericOptions.length > 0 ? (
              <div className="form-group" style={{ flex: "0 0 220px" }}>
                <label className="form-label">পণ্যের নাম</label>
                <select className="form-input" value={row.productName} onChange={e => onUpdate({ productName: e.target.value })}>
                  <option value="">— নির্বাচন করুন —</option>
                  {genericOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ) : (
              <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                <label className="form-label">পণ্যের নাম / বিবরণ</label>
                <input type="text" className="form-input" value={row.productName} onChange={e => onUpdate({ productName: e.target.value })} placeholder="পণ্যের নাম লিখুন..." />
              </div>
            )}
            <div className="form-group" style={{ flex: "0 0 90px" }}>
              <label className="form-label">ইউনিট</label>
              <input type="text" className="form-input" value={row.unit} onChange={e => onUpdate({ unit: e.target.value })} placeholder="পিস/CFT..." />
            </div>
          </>
        )}

        {canRemove && (
          <button
            type="button"
            className="btn btn-ghost btn-icon product-row-card__remove"
            onClick={onRemove}
            title="এই পণ্যটি মুছুন"
            style={{ color: "var(--danger)", marginTop: "1.4rem" }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Row Numbers */}
      <div className="product-row-card__nums">
        <div className="form-group">
          <label className="form-label">পরিমাণ</label>
          <input
            type="number"
            className="form-input"
            value={row.quantity}
            onChange={e => onUpdate({ quantity: e.target.value })}
            min="1"
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">দর / রেট (৳)</label>
          <input
            type="number"
            className="form-input"
            value={row.unitPrice}
            onChange={e => onUpdate({ unitPrice: e.target.value })}
            min="0"
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">ছাড় (৳)</label>
          <input
            type="number"
            className="form-input"
            value={row.discount}
            onChange={e => onUpdate({ discount: e.target.value })}
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">লাইন মোট (৳)</label>
          <div className="form-input" style={{ background: "var(--surface-soft)", fontWeight: 700, color: "var(--primary)", textAlign: "right" }}>
            ৳ {lineTotal.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Live preview line */}
      <div className="product-row-card__preview">
        <span className="product-row-card__preview-label">বিবরণ:</span>
        <span className="product-row-card__preview-text">{buildDescription(row)}</span>
      </div>
    </div>
  );
}
