import { useState } from "react";
import "../styles/auth.css";
import { loginUser } from "../api/auth";

const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password))
    return "Password must include uppercase, lowercase, number, and a special character.";
  return "";
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name] || submitted) {
      setErrors((prev) => ({
        ...prev,
        [name]:
          name === "email" ? validateEmail(value) : validatePassword(value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: name === "email" ? validateEmail(value) : validatePassword(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(validationErrors);
    if (!validationErrors.email && !validationErrors.password) {
      setLoading(true);
      setApiError("");
      try {
        await loginUser(form);
        window.location.href = "/home";
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="auth-page" aria-label="Login page">
      <div className="auth-card">
        {/* decorative icon excluded from accessibility tree via aria-hidden */}
        <div className="auth-brand" aria-hidden="true">
          <span className="brand-icon">📈</span>
        </div>

        {/* SEO: descriptive h1 with primary keyword for search indexing */}
        <h1 className="auth-title">CSE Insights</h1>
        {/* SEO: subtitle reinforces page topic for crawlers */}
        <p className="auth-subtitle">Colombo Stock Exchange Analytics</p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Sign in form"
          noValidate
        >
          <div className="form-group">
            {/* <label> explicitly associated with input via htmlFor/id pairing */}
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
              onBlur={handleBlur}
              placeholder="sample@example.com"
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              aria-required="true"
            />
            {/* role="alert" live region — screen readers announce errors immediately */}
            {errors.email && (
              <span id="email-error" className="error-msg" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            {/* <label> explicitly associated with password input */}
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
              onBlur={handleBlur}
              placeholder="Minimum 8 characters"
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              aria-required="true"
            />
            {/* role="alert" live region for password errors */}
            {errors.password && (
              <span id="password-error" className="error-msg" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {apiError && (
            <span className="error-msg" role="alert">
              {apiError}
            </span>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          {/* link text is descriptive and meaningful out of context */}
          <a href="/forgot-password" className="auth-link">
            Forgot your password?
          </a>
        </p>
        <p className="auth-footer">
          {/* link text is descriptive and meaningful out of context */}
          <a href="/signup" className="auth-link">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
