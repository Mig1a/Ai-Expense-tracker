"use client"
import { supabase } from "../supabaseClient"
import { useState,useEffect } from "react"
import SignIn from "../components/sign-in"
import SignUp from "../components/sign-up"
import ExpenseTracker from "../routes/dashboard"
import "../styles/auth-page.css"
import AIInsights from "../components/AIInsights.jsx"

export default function AuthPage() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState("signin")
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setTheme(prefersDark ? "dark" : "light")

    // Add theme class to document
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light")
  
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  if (session) {
    return (
      <>
        <div className="auth-container">
          <div className="welcome-card">
            <div className="left-content">
              <div className="welcome-avatar">
                <span>{session.user.email.charAt(0).toUpperCase()}</span>
              </div>
              <div className="welcome-content">
                <h1 className="welcome-title">Welcome Back!</h1>
                <p className="welcome-message">You're successfully signed in as {session.user.email}</p>
              </div>
            </div>

            <div className="right-actions">
              <button onClick={async() => {
                await supabase.auth.signOut()
                setSession(null)
                }} className="signout-button">
                Sign out
              </button>

              <button onClick={toggleTheme} className="theme-toggle">
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
          </div>
        </div>


        <div className="dashboard-content">
          
          <ExpenseTracker session={session}/>
          
        </div>
      </>
    )
  }

  return (
    <div className="auth-container">
      <div className="theme-toggle-container">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
      <div className="auth-tabs-container">
        <div className="auth-brand">
          <div className="brand-logo">$</div>
          <h1 className="brand-name">Smart Expense Tracker</h1>
        </div>
        <div class="demo-credentials-banner">
          <span class="demo-icon">ℹ️</span>
          <span>
            Use <strong>demo@expense.cc</strong> with password <strong>2expense?</strong>
          </span>
        </div>

        <div className="tabs">
          <div className="tab-list">
            <button
              className={`tab-button ${activeTab === "signin" ? "active" : ""}`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "signin" ? (
              <SignIn onSignIn={setSession} />
            ) : (
              <SignUp onSignUp={() => setActiveTab("signin")} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
