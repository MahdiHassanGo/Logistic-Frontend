import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save, ArrowLeft, MapPin, User, Truck, Calendar, FileText } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

export default function NewDeliveryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoice") || "";

  const { addDelivery, drivers, vehicles } = useAppData();

  const [formData, setFormData] = useState({
    invoiceId,
    destination: "",
    driverName: drivers.length ? drivers[0].name : "",
    vehicleReg: vehicles.length ? vehicles[0].reg : "",
    date: new Date().toISOString().split("T")[0],
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDelivery = {
      id: `DEL-${Date.now()}`,
      ...formData,
      status: "PENDING"
    };
    addDelivery(newDelivery);
    alert("ডেলিভারি সফলভাবে তৈরি হয়েছে!");
    navigate(`/app/transport/deliveries/${newDelivery.id}`);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>নতুন ডেলিভারি</h2>
          <p>একটি নতুন ডেলিভারি অর্ডার তৈরি করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> ফিরে যান
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <MapPin size={15} /> গন্তব্য তথ্য
            </div>
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">গন্তব্য / ঠিকানা <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ডেলিভারির গন্তব্য লিখুন"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">সংশ্লিষ্ট ইনভয়েস</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="LK-INV-XXXX (ঐচ্ছিক)"
                  value={formData.invoiceId}
                  onChange={e => setFormData({ ...formData, invoiceId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">তারিখ <span className="required">*</span></label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginBottom: "1.25rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <Truck size={15} /> পরিবহন তথ্য
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">ড্রাইভার</label>
                <select className="form-input" value={formData.driverName} onChange={e => setFormData({ ...formData, driverName: e.target.value })}>
                  <option value="">ড্রাইভার নির্বাচন করুন</option>
                  {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  {drivers.length === 0 && <option value="Mr. Rahim (Mock)">Mr. Rahim (Mock)</option>}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">গাড়ি</label>
                <select className="form-input" value={formData.vehicleReg} onChange={e => setFormData({ ...formData, vehicleReg: e.target.value })}>
                  <option value="">গাড়ি নির্বাচন করুন</option>
                  {vehicles.map(v => <option key={v.id} value={v.reg}>{v.reg} ({v.type})</option>)}
                  {vehicles.length === 0 && <option value="DHA-1234 (Mock)">DHA-1234 (Mock)</option>}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginBottom: "1.5rem" }}>
          <div className="form-section">
            <div className="form-section__title">
              <FileText size={15} /> নোট
            </div>
            <div className="form-group">
              <label className="form-label">বিশেষ নির্দেশনা</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="যেকোনো বিশেষ নির্দেশনা লিখুন..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>বাতিল</button>
          <button type="submit" className="btn btn-primary">
            <Save size={17} /> ডেলিভারি তৈরি করুন
          </button>
        </div>
      </form>
    </div>
  );
}
