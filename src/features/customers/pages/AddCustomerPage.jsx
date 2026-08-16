import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../../context/AppDataContext";
import { ArrowLeft, User, Building2, MapPin, DollarSign, FileText } from "lucide-react";
import "../../../styles/customers.css";

export default function AddCustomerPage() {
  const navigate = useNavigate();
  const { addCustomer, customers } = useAppData();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    businessName: "",
    address: "",
    area: "",
    district: "",
    due: 0,
    creditLimit: "",
    notes: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateCustomerId = () => {
    const lastId = customers.length > 0 ? customers[customers.length - 1].id : "CUS-000";
    const num = parseInt(lastId.split("-")[1]) + 1;
    return `CUS-${num.toString().padStart(3, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("নাম এবং ফোন নম্বর আবশ্যক।");
      return;
    }

    const newCustomer = {
      id: generateCustomerId(),
      ...formData,
      due: Number(formData.due),
      status: "ACTIVE"
    };

    addCustomer(newCustomer);
    alert("গ্রাহক সফলভাবে যোগ করা হয়েছে!");
    navigate(`/app/customers/${newCustomer.id}`);
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>নতুন গ্রাহক যোগ করুন</h2>
          <p>নতুন গ্রাহকের তথ্য পূরণ করুন এবং সংরক্ষণ করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline" onClick={() => navigate("/app/customers")}>
            <ArrowLeft size={16} /> ফিরে যান
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "var(--danger-light)", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", color: "var(--danger)", fontSize: "0.9375rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <User size={15} /> ব্যক্তিগত তথ্য
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">গ্রাহকের নাম <span className="required">*</span></label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="পূর্ণ নাম লিখুন" required />
              </div>
              <div className="form-group">
                <label className="form-label">প্রাথমিক ফোন নম্বর <span className="required">*</span></label>
                <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="০১XXXXXXXXX" required />
              </div>
              <div className="form-group">
                <label className="form-label">বিকল্প ফোন নম্বর</label>
                <input type="tel" className="form-input" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} placeholder="ঐচ্ছিক" />
              </div>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <Building2 size={15} /> ব্যবসার তথ্য
            </div>
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">ব্যবসা / প্রতিষ্ঠানের নাম</label>
                <input type="text" className="form-input" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="প্রতিষ্ঠানের নাম (ঐচ্ছিক)" />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <MapPin size={15} /> ঠিকানা
            </div>
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">বিস্তারিত ঠিকানা</label>
                <input type="text" className="form-input" name="address" value={formData.address} onChange={handleChange} placeholder="বাড়ি নম্বর, রাস্তা, এলাকা..." />
              </div>
              <div className="form-group">
                <label className="form-label">এরিয়া</label>
                <input type="text" className="form-input" name="area" value={formData.area} onChange={handleChange} placeholder="এরিয়ার নাম" />
              </div>
              <div className="form-group">
                <label className="form-label">জেলা</label>
                <input type="text" className="form-input" name="district" value={formData.district} onChange={handleChange} placeholder="জেলার নাম" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <DollarSign size={15} /> আর্থিক তথ্য
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">প্রারম্ভিক বকেয়া (৳)</label>
                <input type="number" className="form-input" name="due" value={formData.due} onChange={handleChange} min="0" />
                <span className="form-hint">গ্রাহকের পূর্বের বকেয়া থাকলে এখানে লিখুন</span>
              </div>
              <div className="form-group">
                <label className="form-label">ক্রেডিট সীমা (৳)</label>
                <input type="number" className="form-input" name="creditLimit" value={formData.creditLimit} onChange={handleChange} placeholder="সর্বোচ্চ বাকি সীমা" />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="section-card" style={{ marginBottom: "1.5rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <FileText size={15} /> নোট
            </div>
            <div className="form-group">
              <label className="form-label">অতিরিক্ত তথ্য</label>
              <textarea className="form-input" name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="যেকোনো গুরুত্বপূর্ণ তথ্য লিখুন..." />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/app/customers")}>বাতিল</button>
          <button type="submit" className="btn btn-primary">গ্রাহক সংরক্ষণ করুন</button>
        </div>
      </form>
    </div>
  );
}
