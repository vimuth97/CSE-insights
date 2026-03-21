import { useState } from "react";
import "../styles/auth.css";

const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  // single regex tests lowercase, uppercase, number, and special character together
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password))
    return "Password must include uppercase, lowercase, number, and a special character.";
  return "";
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  // WCAG 2, 3.3.1: track visited fields so errors only show after user has left the field
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    // WCAG 2, 3.3.1 - Error Identification: re-validate on change once field is touched or form submitted
    if (touched[name] || submitted) {
      setErrors((prev) => ({
        ...prev,
        [name]: name === "email" ? validateEmail(value) : validatePassword(value),
      }));
    }
  };

  // WCAG 2, 3.3.1: validate individual field when user leaves it (onBlur)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: name === "email" ? validateEmail(value) : validatePassword(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(validationErrors);
    if (!validationErrors.email && !validationErrors.password) {
      // TODO: connect to auth API
      console.log("Login submitted", form);
    }
  };

  return (
    // WCAG 2, 1.3.1: <main> landmark lets screen readers jump directly to content
    <main className="auth-page" aria-label="Login page">
      <div className="auth-card">
        {/* WCAG 2, 1.1.1: decorative icon excluded from accessibility tree via aria-hidden */}
        <div className="auth-brand" aria-hidden="true">
          <span className="brand-icon">📈</span>
        </div>

        {/* SEO: descriptive h1 with primary keyword for search indexing */}
        <h1 className="auth-title">CSE Insights</h1>
        {/* SEO: subtitle reinforces page topic for crawlers */}
        <p className="auth-subtitle">Colombo Stock Exchange Analytics</p>

        {/* WCAG 2, 4.1.2: aria-label gives the form an accessible name */}
        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Sign in form"
          noValidate
        >
          <div className="form-group">
            {/* WCAG 2, 1.3.1: <label> explicitly associated with input via htmlFor/id pairing */}
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              value={form.email}
              onChange={handleChange}
              // WCAG 2, 3.3.1: validate on blur so errors appear when user leaves the field
              onBlur={handleBlur}
              placeholder="sample@example.com"
              autoComplete="email"
              // WCAG 2, 1.3.1: aria-describedby links input to its error message for screen readers
              aria-describedby={errors.email ? "email-error" : undefined}
              // WCAG 2, 4.1.2: aria-invalid signals invalid state to assistive tech
              aria-invalid={!!errors.email}
              // WCAG 2, 2.4.6: aria-required communicates mandatory field in label/instructions
              aria-required="true"
            />
            {/* WCAG 2, 3.3.1: role="alert" live region — screen readers announce errors immediately */}
            {errors.email && (
              <span id="email-error" className="error-msg" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            {/* WCAG 2, 1.3.1: <label> explicitly associated with password input */}
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? "input-error" : ""}`}
              value={form.password}
              onChange={handleChange}
              // WCAG 2, 3.3.1: validate on blur so errors appear when user leaves the field
              onBlur={handleBlur}
              placeholder="Minimum 8 characters"
              autoComplete="current-password"
              // WCAG 2, 1.3.1: aria-describedby links input to its error message for screen readers
              aria-describedby={errors.password ? "password-error" : undefined}
              // WCAG 2, 4.1.2: aria-invalid signals invalid state to assistive tech
              aria-invalid={!!errors.password}
              // WCAG 2, 2.4.6: aria-required communicates mandatory field in label/instructions
              aria-required="true"
            />
            {/* WCAG 2, 3.3.1: role="alert" live region for password errors */}
            {errors.password && (
              <span id="password-error" className="error-msg" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* WCAG 2, 2.4.6: button label clearly describes the action */}
          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          {/* WCAG 2, 2.4.4: link text is descriptive and meaningful out of context */}
          <a href="/forgot-password" className="auth-link">
            Forgot your password?
          </a>
        </p>
        <p className="auth-footer">
          {/* WCAG 2, 2.4.4: link text is descriptive and meaningful out of context */}
          <a href="/signup" className="auth-link">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
