import { Plus, UserCog } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const roleLabels = {
  OWNER: { label: "মালিক", variant: "primary" },
  ADMIN: { label: "এডমিন", variant: "info" },
  MANAGER: { label: "ম্যানেজার", variant: "neutral" },
  STAFF: { label: "স্টাফ", variant: "neutral" },
};

export default function UsersPage() {
  const { users, addUser } = useAppData();

  const handleAdd = () => {
    const name = prompt("ইউজারের নাম:");
    if (!name) return;
    const role = prompt("রোল (ADMIN, MANAGER, STAFF):");
    addUser({ id: `USER-${Date.now()}`, name, username: name.toLowerCase().replace(" ", ""), role: role || "STAFF", status: "ACTIVE" });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ব্যবহারকারী ব্যবস্থাপনা</h2>
          <p>সিস্টেম ব্যবহারকারী ও তাদের অ্যাক্সেস পরিচালনা করুন।</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={17} /> নতুন ব্যবহারকারী
          </button>
        </div>
      </div>

      <div className="section-card">
        <div className="erp-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>ব্যবহারকারী</th>
                <th>ইউজারনেম</th>
                <th>রোল</th>
                <th>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const role = roleLabels[u.role] || { label: u.role, variant: "neutral" };
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: 36, height: 36, background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: 700, fontSize: "0.9375rem", flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", color: "var(--text-secondary)", fontSize: "0.875rem" }}>{u.username}</td>
                    <td>
                      <span className={`badge badge--${role.variant}`}>{role.label}</span>
                    </td>
                    <td>
                      <span className={`badge badge--${u.status === "ACTIVE" ? "success" : "danger"}`}>
                        <span className="badge-dot" style={{ background: u.status === "ACTIVE" ? "var(--success)" : "var(--danger)" }} />
                        {u.status === "ACTIVE" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <UserCog size={40} className="empty-state__icon" />
                      <p className="empty-state__title">কোনো ব্যবহারকারী নেই</p>
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
