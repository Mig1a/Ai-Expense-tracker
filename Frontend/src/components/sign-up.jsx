"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import "../styles/auth-forms.css"

export default function SignUp({ onSignUp }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }

  async function handleSubmit(e) {
  e.preventDefault()
  setIsLoading(true)
  setMsg(null)

  if (!email || !password || !firstName || !lastName) {
    setMsg({ type: "error", text: "Please fill in all fields." })
    setIsLoading(false)
    return
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setMsg({ type: "error", text: data.error || "Signup failed" })
      return
    }

    // ✅ Backend success — keep your current UI flow
    setMsg({ type: "success", text: "Account created successfully! You can now sign in." })

    // Reset form
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setPasswordStrength(0)

    // Optional callback
    if (onSignUp) {
      setTimeout(() => {
        onSignUp()
      }, 1500)
    }
  } catch (err) {
    setMsg({ type: "error", text: "Something went wrong: " + err.message })
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="auth-card">
      <div className="card-header">
        <h2 className="card-title">Create Account</h2>
        <p className="card-description">Join us today and get started</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="name-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <div className="input-wrapper">
                <input
                  id="firstName"
                  className="form-input"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <div className="input-wrapper">
                <input
                  id="lastName"
                  className="form-input"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email-signup" className="form-label">
              Email address
            </label>
            <div className="input-wrapper">
              <input
                id="email-signup"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password-signup" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                id="password-signup"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  checkPasswordStrength(e.target.value)
                }}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="icon" /> : <EyeIcon className="icon" />}
              </button>
            </div>
            {password && (
              <div className="password-strength">
                <div className="strength-meter">
                  <div className={`strength-segment ${passwordStrength >= 1 ? "active" : ""}`}></div>
                  <div className={`strength-segment ${passwordStrength >= 2 ? "active" : ""}`}></div>
                  <div className={`strength-segment ${passwordStrength >= 3 ? "active" : ""}`}></div>
                  <div className={`strength-segment ${passwordStrength >= 4 ? "active" : ""}`}></div>
                </div>
                <span className="strength-text">
                  {passwordStrength === 0 && "Very weak"}
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "Fair"}
                  {passwordStrength === 3 && "Good"}
                  {passwordStrength === 4 && "Strong"}
                </span>
              </div>
            )}
          </div>

          <div className="terms-checkbox">
            <label className="checkbox-container">
              <input type="checkbox" className="checkbox-input" required />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">
                I agree to the{" "}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {msg && <div className={`alert ${msg.type === "error" ? "alert-error" : "alert-success"}`}>{msg.text}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Creating account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          
        </form>
      </div>
    </div>
  )
}
