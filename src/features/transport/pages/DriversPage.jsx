import { Plus, UserCheck, Phone } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

export default function DriversPage() {
  const { drivers, addDriver } = useAppData();

  const handleAdd = () => {
    const name = prompt("ড্রাইভারের নাম:");
    if (!name) return;
    const phone = prompt("ফোন নম্বর:");
    addDriver({ id: `DRV-${Date.now()}`, name, phone, status: "ACTIVE" });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ড্রাইভার তালিকা</h2>
          <p>আপনার সকল ড্রাইভারের তথ্য পরিচালনা করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={17} /> নতুন ড্রাইভার
          </button>
        </div>
      </div>

      <div className="section-card">
        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>ড্রাইভার আইডি</th>
                <th>নাম</th>
                <th>ফোন নম্বর</th>
                <th>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", background: "var(--surface-soft)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                      {d.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: 32, height: 32, background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                        {d.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{d.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-secondary)" }}>
                      <Phone size={13} />
                      {d.phone}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge--${d.status === "ACTIVE" ? "success" : "neutral"}`}>
                      <span className="badge-dot" style={{ background: d.status === "ACTIVE" ? "var(--success)" : "var(--text-muted)" }} />
                      {d.status === "ACTIVE" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <UserCheck size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো ড্রাইভার নেই</p>
                      <p className="empty-state__desc">নতুন ড্রাইভার যোগ করুন।</p>
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
