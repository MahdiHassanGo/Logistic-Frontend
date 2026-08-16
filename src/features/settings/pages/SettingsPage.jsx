import { useState } from "react";
import { Save, Shield, Download, Upload, Moon, Sun, Building2, MessageSquare, Palette, Database, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const SECTIONS = [
  { id: "company", label: "কোম্পানি", icon: Building2 },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "appearance", label: "অ্যাপিয়ারেন্স", icon: Palette },
  { id: "backup", label: "ব্যাকআপ", icon: Database },
];

export default function SettingsPage() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("company");
  const [theme, setTheme] = useState(localStorage.getItem("logikhata_theme") || "light");

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("logikhata_theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark-theme");
    else document.documentElement.classList.remove("dark-theme");
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("সেটিংস সফলভাবে সংরক্ষিত হয়েছে! (Frontend Simulation)");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>সেটিংস</h2>
          <p>সিস্টেম, কোম্পানি ও SMS কনফিগারেশন পরিচালনা করুন।</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Settings Navigation */}
        <div className="section-card">
          <div className="section-card__body" style={{ padding: "0.75rem" }}>
            {SECTIONS.map(sec => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: activeSection === sec.id ? "var(--primary)" : "var(--text-muted)",
                    background: activeSection === sec.id ? "var(--primary-light)" : "transparent",
                    border: "none",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    marginBottom: "2px",
                  }}
                >
                  <Icon size={17} />
                  {sec.label}
                </button>
              );
            })}
            <div style={{ height: "1px", background: "var(--border)", margin: "0.75rem 0" }} />
            <button
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--danger)",
                background: "transparent",
                border: "none",
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <LogOut size={17} /> লগআউট
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <form onSubmit={handleSave}>
          {activeSection === "company" && (
            <div className="section-card">
              <div className="section-card__header">
                <h3 className="section-card__title">কোম্পানির তথ্য</h3>
              </div>
              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label className="form-label">কোম্পানির নাম</label>
                    <input type="text" className="form-input" defaultValue="LogiKhata" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ফোন নম্বর</label>
                    <input type="text" className="form-input" defaultValue="01712-345678" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ইমেইল</label>
                    <input type="email" className="form-input" defaultValue="info@logikhata.com" />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">ঠিকানা</label>
                    <textarea className="form-input" rows="2" defaultValue="১২২/ক, তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮" />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">ইনভয়েস ফুটার নোট</label>
                    <input type="text" className="form-input" defaultValue="আপনার ব্যবসার জন্য আমাদের সাথে থাকার জন্য ধন্যবাদ।" />
                  </div>
                </div>
              </div>
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary"><Save size={16} /> সেটিংস সেভ করুন</button>
              </div>
            </div>
          )}

          {activeSection === "sms" && (
            <div className="section-card">
              <div className="section-card__header">
                <h3 className="section-card__title">SMS কনফিগারেশন</h3>
              </div>
              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label className="form-label">API Provider URL</label>
                    <input type="text" className="form-input" defaultValue="https://api.bulksmsbd.com/api/v3/sendsms" disabled />
                    <span className="form-hint">Backend integration প্রয়োজন</span>
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">API Token / Secret</label>
                    <input type="password" className="form-input" defaultValue="**********mock-token**********" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sender ID</label>
                    <input type="text" className="form-input" defaultValue="8809612345678" />
                  </div>
                </div>
              </div>
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary"><Save size={16} /> সেটিংস সেভ করুন</button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="section-card">
              <div className="section-card__header">
                <h3 className="section-card__title">অ্যাপিয়ারেন্স (থিম)</h3>
              </div>
              <div className="form-section">
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`btn ${theme === "light" ? "btn-primary" : "btn-outline"}`}
                  >
                    <Sun size={17} /> Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`btn ${theme === "dark" ? "btn-primary" : "btn-outline"}`}
                  >
                    <Moon size={17} /> Dark Mode
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "backup" && (
            <div className="section-card">
              <div className="section-card__header">
                <h3 className="section-card__title">ব্যাকআপ ও রিস্টোর</h3>
              </div>
              <div className="form-section">
                <p className="form-hint" style={{ marginBottom: "1.5rem", fontSize: "0.9375rem" }}>
                  ডাটাবেস ব্যাকআপ ও রিস্টোর সম্পন্ন করতে backend integration প্রয়োজন।
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-outline" onClick={() => alert("Backend integration required for Backup.")}>
                    <Download size={17} /> ডাটাবেস ব্যাকআপ
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => alert("Backend integration required for Restore.")}>
                    <Upload size={17} /> রিস্টোর
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
