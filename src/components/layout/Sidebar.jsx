import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Box, ShoppingCart, FileText,
  CreditCard, AlertCircle, Truck, FileBarChart,
  MessageSquare, UserCog, Settings, X, ChevronDown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function AppLogo() {
  return (
    <div className="app-logo">
      <div className="app-logo__icon-wrap">
        <Truck size={22} color="#fff" />
      </div>
      <div className="app-logo__text">
        <span className="app-logo__name">LogiKhata</span>
        <span className="app-logo__tagline">লজিস্টিকস ম্যানেজমেন্ট সিস্টেম</span>
      </div>
    </div>
  );
}

const mainNav = [
  { path: "/app/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
];

const businessNav = [
  { path: "/app/customers", label: "গ্রাহক", icon: Users },
  { path: "/app/products", label: "পণ্য", icon: Box },
  { path: "/app/purchases", label: "ক্রয়", icon: ShoppingCart },
  { path: "/app/invoices", label: "ইনভয়েস", icon: FileText },
  { path: "/app/payments", label: "পেমেন্ট", icon: CreditCard },
  { path: "/app/dues", label: "বকেয়া", icon: AlertCircle },
];

const transportNav = [
  { path: "/app/transport/deliveries", label: "ডেলিভারি" },
  { path: "/app/transport/drivers", label: "ড্রাইভার" },
  { path: "/app/transport/vehicles", label: "গাড়ি" },
];

const systemNav = [
  { path: "/app/reports", label: "রিপোর্টস", icon: FileBarChart },
  { path: "/app/sms-history", label: "SMS ইতিহাস", icon: MessageSquare },
  { path: "/app/users", label: "ব্যবহারকারী", icon: UserCog },
  { path: "/app/settings", label: "সেটিংস", icon: Settings },
];

function NavItem({ path, label, icon: Icon, onClick }) {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) => `sidebar__link${isActive ? " sidebar__link--active" : ""}`}
        onClick={onClick}
      >
        {Icon && <Icon size={19} className="sidebar__link-icon" />}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const [transportOpen, setTransportOpen] = useState(false);

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`} aria-label="Main navigation">
        <div className="sidebar__header">
          <AppLogo />
          <button className="sidebar__close-btn" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <ul>
            {/* Main */}
            {mainNav.map(item => <NavItem key={item.path} {...item} onClick={onClose} />)}

            {/* Business */}
            <li className="sidebar__section-label">ব্যবসা</li>
            {businessNav.map(item => <NavItem key={item.path} {...item} onClick={onClose} />)}

            {/* Transport */}
            <li className="sidebar__section-label">পরিবহন</li>
            <li>
              <button
                className="sidebar__toggle-btn"
                onClick={() => setTransportOpen(o => !o)}
                aria-expanded={transportOpen}
              >
                <Truck size={19} className="sidebar__link-icon" />
                <span>পরিবহন</span>
                <ChevronDown
                  size={15}
                  className={`sidebar__toggle-chevron${transportOpen ? " sidebar__toggle-chevron--open" : ""}`}
                />
              </button>
              {transportOpen && (
                <ul className="sidebar__sub-nav">
                  {transportNav.map(item => <NavItem key={item.path} {...item} onClick={onClose} />)}
                </ul>
              )}
            </li>

            {/* System */}
            <li className="sidebar__section-label">ম্যানেজমেন্ট</li>
            {systemNav.map(item => <NavItem key={item.path} {...item} onClick={onClose} />)}
          </ul>
        </nav>
      </aside>
    </>
  );
}
