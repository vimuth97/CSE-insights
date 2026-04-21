import { useState } from "react";
import "../styles/auth.css";
import { registerUser } from "../api/auth";

const validateFirstName = (name) => {
  if (!name) return "First name is required.";
  if (name.trim().length < 2)
    return "First name must be at least 2 characters.";
  return "";
};

const validateLastName = (name) => {
  if (!name) return "Last name is required.";
  if (name.trim().length < 2) return "Last name must be at least 2 characters.";
  return "";
};

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

const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return "Please confirm your password.";
  if (confirmPassword !== password) return "Passwords do not match.";
  return "";
};

const FIELDS = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
];

export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const getFieldError = (name, value, currentForm) => {
    if (name === "firstName") return validateFirstName(value);
    if (name === "lastName") return validateLastName(value);
    if (name === "email") return validateEmail(value);
    if (name === "password") return validatePassword(value);
    if (name === "confirmPassword")
      return validateConfirmPassword(value, currentForm.password);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name] || submitted) {
      setErrors((prev) => ({
        ...prev,
        [name]: getFieldError(name, value, updated),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: getFieldError(name, value, form),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = FIELDS.reduce((acc, name) => {
      acc[name] = getFieldError(name, form[name], form);
      return acc;
    }, {});
    setErrors(validationErrors);
    if (FIELDS.every((name) => !validationErrors[name])) {
      setLoading(true);
      setApiError("");
      try {
        await registerUser(form);
        window.location.href = "/";
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="auth-page" aria-label="Sign up page">
      <div className="auth-card">
        {/* decorative icon excluded from accessibility tree via aria-hidden */}
        <div className="auth-brand" aria-hidden="true">
          <span className="brand-icon">📈</span>
        </div>

        {/* SEO: descriptive h1 with primary keyword for search indexing */}
        <h1 className="auth-title">CSE Insights</h1>
        {/* SEO: subtitle reinforces page topic for crawlers */}
        <p className="auth-subtitle">Create your account</p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Sign up form"
          noValidate
        >
          {/* 2-column grid on desktop, stacks to 1 column on mobile — see .form-row in auth.css */}
          <div className="form-row">
            <div className="form-group">
              {/* <label> explicitly associated with input via htmlFor/id pairing */}
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={`form-input ${errors.firstName ? "input-error" : ""}`}
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane"
                autoComplete="given-name"
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
                aria-invalid={!!errors.firstName}
                aria-required="true"
              />
              {/* role="alert" live region — screen readers announce errors immediately */}
              {errors.firstName && (
                <span id="firstName-error" className="error-msg" role="alert">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="form-group">
              {/* <label> explicitly associated with input via htmlFor/id pairing */}
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={`form-input ${errors.lastName ? "input-error" : ""}`}
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Doe"
                autoComplete="family-name"
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
                aria-invalid={!!errors.lastName}
                aria-required="true"
              />
              {/* role="alert" live region — screen readers announce errors immediately */}
              {errors.lastName && (
                <span id="lastName-error" className="error-msg" role="alert">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
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
            {errors.email && (
              <span id="email-error" className="error-msg" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
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
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              aria-required="true"
            />
            {errors.password && (
              <span id="password-error" className="error-msg" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              aria-invalid={!!errors.confirmPassword}
              aria-required="true"
            />
            {errors.confirmPassword && (
              <span
                id="confirmPassword-error"
                className="error-msg"
                role="alert"
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {apiError && (
            <span className="error-msg" role="alert">
              {apiError}
            </span>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
