import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const routeMap = {
  "/app/dashboard": { title: "ড্যাশবোর্ড", crumb: "হোম / ড্যাশবোর্ড" },
  "/app/customers": { title: "গ্রাহক তালিকা", crumb: "হোম / গ্রাহক" },
  "/app/customers/new": { title: "নতুন গ্রাহক", crumb: "হোম / গ্রাহক / নতুন" },
  "/app/products": { title: "পণ্য তালিকা", crumb: "হোম / পণ্য" },
  "/app/purchases": { title: "ক্রয় তালিকা", crumb: "হোম / ক্রয়" },
  "/app/purchases/new": { title: "নতুন ক্রয়", crumb: "হোম / ক্রয় / নতুন" },
  "/app/invoices": { title: "ইনভয়েস তালিকা", crumb: "হোম / ইনভয়েস" },
  "/app/payments": { title: "পেমেন্ট তালিকা", crumb: "হোম / পেমেন্ট" },
  "/app/payments/new": { title: "পেমেন্ট গ্রহণ", crumb: "হোম / পেমেন্ট / নতুন" },
  "/app/dues": { title: "বকেয়া ব্যবস্থাপনা", crumb: "হোম / বকেয়া" },
  "/app/transport/deliveries": { title: "ডেলিভারি তালিকা", crumb: "হোম / পরিবহন / ডেলিভারি" },
  "/app/transport/deliveries/new": { title: "নতুন ডেলিভারি", crumb: "হোম / পরিবহন / নতুন" },
  "/app/transport/drivers": { title: "ড্রাইভার তালিকা", crumb: "হোম / পরিবহন / ড্রাইভার" },
  "/app/transport/vehicles": { title: "গাড়ির তালিকা", crumb: "হোম / পরিবহন / গাড়ি" },
  "/app/reports": { title: "রিপোর্টস", crumb: "হোম / রিপোর্টস" },
  "/app/sms-history": { title: "SMS ইতিহাস", crumb: "হোম / SMS" },
  "/app/users": { title: "ব্যবহারকারী", crumb: "হোম / ম্যানেজমেন্ট / ইউজার" },
  "/app/settings": { title: "সেটিংস", crumb: "হোম / সেটিংস" },
};

export default function Topbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pathname = location.pathname;
  const info = routeMap[pathname] ||
    (pathname.startsWith("/app/customers/") ? { title: "গ্রাহক প্রোফাইল", crumb: "হোম / গ্রাহক / প্রোফাইল" } :
    pathname.startsWith("/app/purchases/") ? { title: "ক্রয় বিস্তারিত", crumb: "হোম / ক্রয় / বিস্তারিত" } :
    pathname.startsWith("/app/invoices/") ? { title: "ইনভয়েস", crumb: "হোম / ইনভয়েস / বিস্তারিত" } :
    pathname.startsWith("/app/payments/") ? { title: "পেমেন্ট বিস্তারিত", crumb: "হোম / পেমেন্ট / বিস্তারিত" } :
    pathname.startsWith("/app/transport/deliveries/") ? { title: "ডেলিভারি বিস্তারিত", crumb: "হোম / পরিবহন / বিস্তারিত" } :
    { title: "LogiKhata", crumb: "" });

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open navigation menu">
          <Menu size={22} />
        </button>
        <div className="topbar__page-info">
          <h1 className="topbar__title">{info.title}</h1>
          {info.crumb && <span className="topbar__breadcrumb">{info.crumb}</span>}
        </div>
      </div>

      <div className="topbar__right">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="topbar__notif-dot" />
        </button>

        <div className="topbar__profile" ref={dropRef}>
          <button
            className="topbar__profile-btn"
            onClick={() => setProfileOpen(o => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="topbar__avatar">A</div>
            <div className="topbar__user-info">
              <span className="topbar__username">অ্যাডমিন</span>
              <span className="topbar__role">OWNER</span>
            </div>
            <ChevronDown size={15} className="topbar__chevron" />
          </button>

          {profileOpen && (
            <div className="topbar__dropdown" role="menu">
              <button className="topbar__dropdown-item" role="menuitem" onClick={() => { setProfileOpen(false); navigate("/app/settings"); }}>
                <Settings size={16} />
                <span>সেটিংস</span>
              </button>
              <div className="topbar__dropdown-divider" />
              <button className="topbar__dropdown-item topbar__dropdown-item--danger" role="menuitem" onClick={handleLogout}>
                <LogOut size={16} />
                <span>লগআউট</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
