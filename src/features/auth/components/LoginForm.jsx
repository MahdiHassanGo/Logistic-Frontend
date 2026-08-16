import { useState } from "react";

/* ── SVG Icons ── */
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path
        d="M2 7l10 7 10-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path
        d="M8 11V7a4 4 0 018 0v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.25" fill="currentColor" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" fill="none" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.12 14.12a3 3 0 01-4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6l3 3 5-5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/* ── Google SVG Logo ── */
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

/* ── Field Error ── */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="field-error" role="alert">
      {message}
    </p>
  );
}

/* ── Login method tabs ── */
const LOGIN_METHODS = [
  { id: "phone", label: "ফোন নম্বর" },
  { id: "email", label: "ইমেইল" },
];

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ── Main Component ── */
function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ identifier: "", password: "" });

  const validate = () => {
    const next = { identifier: "", password: "" };
    let valid = true;

    if (!identifier.trim()) {
      next.identifier = "ফোন নম্বর বা ইমেইল প্রদান করুন";
      valid = false;
    }

    if (!password.trim()) {
      next.password = "পাসওয়ার্ড প্রদান করুন";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate authentication process
    login();
    navigate("/app/dashboard");

    console.log("Login submitted:", {
      identifier,
      password,
      remember,
    });
  };

  // Determine which icon to show based on input content
  const isEmail = identifier.includes("@");

  return (
    <div className="login-card" role="main">
      {/* Heading */}
      <div className="login-heading">
        <h2 className="login-title">আপনাকে স্বাগতম</h2>
        <p className="login-subtitle">
          আপনার ব্যবসায়িক ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।
        </p>
      </div>

      {/*
       * Google OAuth button — UI only.
       * Google authentication will be implemented when backend OAuth integration is ready.
       */}
      <button
        type="button"
        className="google-btn"
        aria-label="গুগল দিয়ে লগইন করুন"
      >
        <GoogleLogo />
        <span>গুগল দিয়ে চালিয়ে যান</span>
      </button>

      {/* Divider */}
      <div className="divider" aria-hidden="true">
        <span>অথবা</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Single identifier field — phone or email */}
        <div className={`form-group ${errors.identifier ? "form-group--error" : ""}`}>
          <label htmlFor="identifier" className="form-label">
            ফোন নম্বর বা ইমেইল
          </label>
          <div className="input-wrapper">
            <span className="input-icon" aria-hidden="true">
              {isEmail ? <MailIcon /> : <PhoneIcon />}
            </span>
            <input
              id="identifier"
              type="text"
              className="form-input"
              placeholder="আপনার ফোন নম্বর বা ইমেইল লিখুন"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: "" }));
              }}
              autoComplete="username"
              aria-invalid={errors.identifier ? "true" : "false"}
            />
          </div>
          <FieldError message={errors.identifier} />
        </div>

        {/* Password */}
        <div className={`form-group ${errors.password ? "form-group--error" : ""}`}>
          <label htmlFor="password" className="form-label">
            পাসওয়ার্ড
          </label>
          <div className="input-wrapper">
            <span className="input-icon" aria-hidden="true">
              <LockIcon />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-input form-input--password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              autoComplete="current-password"
              aria-invalid={errors.password ? "true" : "false"}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <FieldError message={errors.password} />
        </div>

        {/* Remember + Forgot */}
        <div className="form-options">
          <label className="custom-checkbox-label">
            <span className="custom-checkbox-input">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-label="আমাকে মনে রাখুন"
              />
              <span className="custom-checkbox-box" aria-hidden="true">
                {remember && <CheckIcon />}
              </span>
            </span>
            <span className="custom-checkbox-text">আমাকে মনে রাখুন</span>
          </label>

          {/* TODO: Wire to password reset flow when backend is ready */}
          <button type="button" className="forgot-password-btn">
            পাসওয়ার্ড ভুলে গেছেন?
          </button>
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn">
          লগইন করুন
        </button>
      </form>

      {/* Security note */}
      <div className="secure-note">
        <span className="secure-note__icon">
          <ShieldCheckIcon />
        </span>
        <span>আপনার তথ্য নিরাপদ ও এনক্রিপ্টেড</span>
      </div>
    </div>
  );
}

export default LoginForm;
