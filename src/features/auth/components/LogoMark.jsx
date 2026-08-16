function LogoMark({ size = 48, className = "" }) {
  return (
    <div
      className={`logo-mark-container ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Truck body */}
        <rect
          x="4"
          y="13"
          width="20"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />
        {/* Truck cab */}
        <path
          d="M24 18h6.5l3.5 4.5V27H24V18Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Wheels */}
        <circle cx="10" cy="28.5" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <circle cx="28" cy="28.5" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
        {/* Ledger lines on body */}
        <line x1="8" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default LogoMark;
