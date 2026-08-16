import BrandPanel from "../components/BrandPanel";
import LoginForm from "../components/LoginForm";
import LogoMark from "../components/LogoMark";

function LoginPage() {
  return (
    <main className="page-shell">
      {/* Left — brand/marketing panel (desktop only) */}
      <BrandPanel />

      {/* Right — login area */}
      <section className="login-panel" aria-label="লগইন">
        <div className="login-wrap">

          {/* Mobile brand header — hidden on desktop */}
          <div className="mobile-brand" aria-label="LogiKhata">
            <LogoMark size={44} className="mobile-logomark" />
            <div className="mobile-brand__text">
              <p className="mobile-brand__name">LogiKhata</p>
              <p className="mobile-brand__tagline">লজিস্টিকস ম্যানেজমেন্ট সিস্টেম</p>
            </div>
          </div>

          <LoginForm />

          {/* Mobile copyright footer — hidden on desktop */}
          <footer className="mobile-footer">
            © ২০২৬ LogiKhata. সর্বস্বত্ব সংরক্ষিত।
          </footer>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
