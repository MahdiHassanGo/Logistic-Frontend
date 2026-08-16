import { Link } from "react-router-dom";
import { Truck } from "lucide-react";

export default function AppLogo() {
  return (
    <Link to="/" className="app-logo">
      <div className="app-logo__icon">
        <Truck size={24} color="currentColor" />
      </div>
      <div className="app-logo__text">
        <span className="app-logo__name">LogiKhata</span>
        <span className="app-logo__tagline">লজিস্টিকস ম্যানেজমেন্ট</span>
      </div>
    </Link>
  );
}
