import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";
import "../../../styles/dashboard.css";

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payments, customers } = useAppData();

  const payment = payments.find(p => p.id === id);
  if (!payment) return <div className="card">Payment not found.</div>;
  const customer = customers.find(c => c.id === payment.customerId);

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ padding: "0.5rem" }}>
          <ArrowLeft size={18} />
        </button>
        <button className="btn-primary" onClick={() => window.print()}>
          <Printer size={18} /><span>রসিদ প্রিন্ট করুন</span>
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>পেমেন্ট রসিদ</h2>
        <p className="text-muted">রসিদ নম্বর: {payment.id}</p>
        <p className="text-muted">তারিখ: {new Date(payment.date).toLocaleDateString('bn-BD')}</p>
      </div>

      <table style={{ width: "100%", marginBottom: "2rem" }} className="dashboard-table">
        <tbody>
          <tr>
            <td style={{ color: "var(--text-muted)", width: "40%" }}>গ্রাহক:</td>
            <td style={{ fontWeight: 600 }}>{customer?.name} ({customer?.phone})</td>
          </tr>
          <tr>
            <td style={{ color: "var(--text-muted)" }}>পেমেন্ট মেথড:</td>
            <td>{payment.method}</td>
          </tr>
          <tr>
            <td style={{ color: "var(--text-muted)" }}>রেফারেন্স:</td>
            <td>{payment.reference || '-'}</td>
          </tr>
          <tr>
            <td style={{ color: "var(--text-muted)" }}>নোট:</td>
            <td>{payment.notes || '-'}</td>
          </tr>
          <tr>
            <td style={{ color: "var(--text-muted)", fontSize: "1.125rem" }}>পরিমাণ:</td>
            <td style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--success)" }}>
              ৳ {payment.amount.toLocaleString('en-IN')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
