"use client"

import { useState } from "react"
import { supabase } from "../supabaseClient"
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import "../styles/auth-forms.css"

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)


  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message +'hello')
      } else {
        setError(null)
        onSignIn(data.session) // ✅ pass user session to parent component or global state
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
}

  return (
    <div className="auth-card">
      <div className="card-header">
        <h2 className="card-title">Welcome Back</h2>
        <p className="card-description">Sign in to your account to continue</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSignIn} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
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
            <div className="label-row">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <div className="remember-me-container">
            <label className="checkbox-container">
              <input type="checkbox" className="checkbox-input" />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">Remember me</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>


        </form>
      </div>
    </div>
  )
}