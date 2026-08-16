import { Plus, Truck } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

export default function VehiclesPage() {
  const { vehicles, addVehicle } = useAppData();

  const handleAdd = () => {
    const reg = prompt("গাড়ির রেজিস্ট্রেশন নম্বর:");
    if (!reg) return;
    const type = prompt("গাড়ির ধরন (যেমন: ট্রাক, পিকআপ):");
    addVehicle({ id: `VEH-${Date.now()}`, reg, type, status: "ACTIVE" });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>গাড়ির তালিকা</h2>
          <p>আপনার ফ্লিটের সকল গাড়ি পরিচালনা করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={17} /> নতুন গাড়ি
          </button>
        </div>
      </div>

      <div className="section-card">
        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>গাড়ির আইডি</th>
                <th>রেজিস্ট্রেশন নম্বর</th>
                <th>ধরন</th>
                <th>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", background: "var(--surface-soft)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                      {v.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: 32, height: 32, background: "#fff7ed", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ea580c", flexShrink: 0 }}>
                        <Truck size={16} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{v.reg}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{v.type}</td>
                  <td>
                    <span className={`badge badge--${v.status === "ACTIVE" ? "success" : "neutral"}`}>
                      <span className="badge-dot" style={{ background: v.status === "ACTIVE" ? "var(--success)" : "var(--text-muted)" }} />
                      {v.status === "ACTIVE" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <Truck size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো গাড়ি নেই</p>
                      <p className="empty-state__desc">নতুন গাড়ি যোগ করে শুরু করুন।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
