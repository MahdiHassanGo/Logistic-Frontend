import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FileText, CreditCard, Truck } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/dashboard.css";

export default function PurchaseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { purchases, customers } = useAppData();

  const purchase = purchases.find(p => p.id === id);
  if (!purchase) return <div className="card">Purchase not found.</div>;
  const customer = customers.find(c => c.id === purchase.customerId);

  return (
    <div className="purchase-details-page">
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button className="btn-outline" onClick={() => navigate(-1)} style={{ padding: "0.5rem" }}>
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ margin: 0 }}>ক্রয় বিস্তারিত: {purchase.id}</h2>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn-outline" onClick={() => navigate(`/app/invoices/${purchase.id}`)}>
              <FileText size={18} /><span>ইনভয়েস</span>
            </button>
            <button className="btn-primary" style={{ background: "var(--success)" }} onClick={() => navigate(`/app/payments/new?invoice=${purchase.id}`)}>
              <CreditCard size={18} /><span>পেমেন্ট নিন</span>
            </button>
            <button className="btn-outline" onClick={() => navigate(`/app/transport/deliveries/new?invoice=${purchase.id}`)}>
              <Truck size={18} /><span>ডেলিভারি</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>গ্রাহকের তথ্য</h4>
            <p><strong>{customer?.name}</strong></p>
            <p>{customer?.phone}</p>
            <p>{customer?.address}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>ক্রয় তথ্য</h4>
            <p>তারিখ: {new Date(purchase.date).toLocaleDateString('bn-BD')}</p>
            <p>স্ট্যাটাস: <span className={`badge badge--${purchase.status === 'PAID' ? 'success' : 'danger'}`}>{purchase.status}</span></p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1.5rem" }}>পণ্যের বিবরণ</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>পণ্য</th>
              <th>পরিমাণ</th>
              <th>দর</th>
              <th>মোট</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items && purchase.items.length > 0 ? (
              purchase.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>৳ {item.unitPrice.toLocaleString('en-IN')}</td>
                  <td>৳ {((item.quantity * item.unitPrice) - item.discount).toLocaleString('en-IN')}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>No items detailed</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ width: "300px", marginLeft: "auto", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>সর্বমোট:</span>
            <strong>৳ {purchase.amount.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>পরিশোধিত:</span>
            <strong className="text-success">৳ {purchase.paid.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "2px solid var(--border)", fontSize: "1.25rem", color: "var(--danger)", fontWeight: "bold" }}>
            <span>বর্তমান বকেয়া:</span>
            <span>৳ {purchase.due.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
