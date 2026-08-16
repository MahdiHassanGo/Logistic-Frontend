import LogoMark from "./LogoMark";

/* SVG icons for feature pills */
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1.75" fill="none" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path
        d="M15 11h4.5l2.5 3v3H15v-6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="6.5" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <circle cx="18.5" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
    </svg>
  );
}

const features = [
  { icon: <ShieldIcon />, label: "নিরাপদ তথ্য" },
  { icon: <ChartIcon />, label: "স্মার্ট রিপোর্ট" },
  { icon: <TruckIcon />, label: "পরিবহন নিয়ন্ত্রণ" },
];

function BrandPanel() {
  return (
    <section className="brand-panel" aria-label="LogiKhata brand information">
      {/* Decorative background shapes */}
      <div className="brand-bg-circle brand-bg-circle--1" aria-hidden="true" />
      <div className="brand-bg-circle brand-bg-circle--2" aria-hidden="true" />
      <div className="brand-dot-grid" aria-hidden="true" />

      {/* Logo + wordmark */}
      <div className="brand-identity">
        <LogoMark className="brand-logomark" />
        <div className="brand-wordmark">
          <span className="brand-wordmark__name">LogiKhata</span>
          <span className="brand-wordmark__tagline">লজিস্টিকস ম্যানেজমেন্ট সিস্টেম</span>
        </div>
      </div>

      {/* Main copy */}
      <div className="brand-copy">
        <h1 className="brand-headline">
          আপনার ব্যবসার হিসাব ও<br />
          লজিস্টিকস—এক জায়গায়।
        </h1>
        <p className="brand-description">
          ক্রয়, বিক্রয়, ইনভয়েস, বকেয়া, পরিবহন এবং গ্রাহক ব্যবস্থাপনা
          আরও সহজ, দ্রুত ও নির্ভরযোগ্যভাবে পরিচালনা করুন।
        </p>

        <div className="feature-list" role="list">
          {features.map(({ icon, label }) => (
            <div className="feature-pill" role="listitem" key={label}>
              <span className="feature-pill__icon">{icon}</span>
              <span className="feature-pill__label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="brand-footer">
        <p>© ২০২৬ LogiKhata. সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </section>
  );
}

export default BrandPanel;
