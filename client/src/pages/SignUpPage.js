import { useState } from "react";
import "./auth.css";

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
  // single regex tests lowercase, uppercase, number, and special character together
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
  // WCAG 2, 3.3.1: track visited fields so errors only show after user has left the field
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [submitted, setSubmitted] = useState(false);

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
    // WCAG 2, 3.3.1 - Error Identification: re-validate on change once field is touched or form submitted
    if (touched[name] || submitted) {
      setErrors((prev) => ({
        ...prev,
        [name]: getFieldError(name, value, updated),
      }));
    }
  };

  // WCAG 2, 3.3.1: validate individual field when user leaves it (onBlur)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: getFieldError(name, value, form),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = FIELDS.reduce((acc, name) => {
      acc[name] = getFieldError(name, form[name], form);
      return acc;
    }, {});
    setErrors(validationErrors);
    if (FIELDS.every((name) => !validationErrors[name])) {
      // TODO: connect to auth API
      console.log("Sign up submitted", form);
    }
  };

  return (
    // WCAG 2, 1.3.1: <main> landmark lets screen readers jump directly to content
    <main className="auth-page" aria-label="Sign up page">
      <div className="auth-card">
        {/* WCAG 2, 1.1.1: decorative icon excluded from accessibility tree via aria-hidden */}
        <div className="auth-brand" aria-hidden="true">
          <span className="brand-icon">📈</span>
        </div>

        {/* SEO: descriptive h1 with primary keyword for search indexing */}
        <h1 className="auth-title">CSE Insights</h1>
        {/* SEO: subtitle reinforces page topic for crawlers */}
        <p className="auth-subtitle">Create your account</p>

        {/* WCAG 2, 4.1.2: aria-label gives the form an accessible name */}
        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Sign up form"
          noValidate
        >
          {/* 2-column grid on desktop, stacks to 1 column on mobile — see .form-row in auth.css */}
          <div className="form-row">
            <div className="form-group">
              {/* WCAG 2, 1.3.1: <label> explicitly associated with input via htmlFor/id pairing */}
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
                // WCAG 2, 3.3.1: validate on blur so errors appear when user leaves the field
                onBlur={handleBlur}
                placeholder="Jane"
                autoComplete="given-name"
                // WCAG 2, 1.3.1: aria-describedby links input to its error message for screen readers
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
                // WCAG 2, 4.1.2: aria-invalid signals invalid state to assistive tech
                aria-invalid={!!errors.firstName}
                // WCAG 2, 2.4.6: aria-required communicates mandatory field in label/instructions
                aria-required="true"
              />
              {/* WCAG 2, 3.3.1: role="alert" live region — screen readers announce errors immediately */}
              {errors.firstName && (
                <span id="firstName-error" className="error-msg" role="alert">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="form-group">
              {/* WCAG 2, 1.3.1: <label> explicitly associated with input via htmlFor/id pairing */}
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
                // WCAG 2, 3.3.1: validate on blur so errors appear when user leaves the field
                onBlur={handleBlur}
                placeholder="Doe"
                autoComplete="family-name"
                // WCAG 2, 1.3.1: aria-describedby links input to its error message for screen readers
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
                // WCAG 2, 4.1.2: aria-invalid signals invalid state to assistive tech
                aria-invalid={!!errors.lastName}
                // WCAG 2, 2.4.6: aria-required communicates mandatory field in label/instructions
                aria-required="true"
              />
              {/* WCAG 2, 3.3.1: role="alert" live region — screen readers announce errors immediately */}
              {errors.lastName && (
                <span id="lastName-error" className="error-msg" role="alert">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

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
              autoComplete="new-password"
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

          <div className="form-group">
            {/* WCAG 2, 1.3.1: <label> explicitly associated with confirm password input */}
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
              // WCAG 2, 3.3.1: validate on blur so errors appear when user leaves the field
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              // WCAG 2, 1.3.1: aria-describedby links input to its error message for screen readers
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              // WCAG 2, 4.1.2: aria-invalid signals invalid state to assistive tech
              aria-invalid={!!errors.confirmPassword}
              // WCAG 2, 2.4.6: aria-required communicates mandatory field in label/instructions
              aria-required="true"
            />
            {/* WCAG 2, 3.3.1: role="alert" live region for confirm password errors */}
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

          {/* WCAG 2, 2.4.6: button label clearly describes the action */}
          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          {/* WCAG 2, 2.4.4: link text is descriptive and meaningful out of context */}
          <a href="/login" className="auth-link">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
