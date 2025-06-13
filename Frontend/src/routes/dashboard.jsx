import React, { useState, useEffect } from 'react'
import '../styles/dashboard.css'
import { supabase } from '../supabaseClient'
import AIInsights from '../components/AIInsights'
import ExpensePieChart from "../components/expense-pie-chart"

const ExpenseTracker = ({ session }) => {
  const [amount, setAmount] = useState('0.00')
  const [category, setCategory] = useState('General')
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const expense_date = new Date().toISOString().split('T')[0]

  // ✅ Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = session?.access_token
        const res = await fetch(`${import.meta.env.VITE_API_URL}/expenses`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok) {
          alert(data.error || 'Failed to load expenses')
          return
        }

        setExpenses(
          data.map((exp) => ({
            id: exp.id,
            amount: parseFloat(exp.amount).toFixed(2),
            category: exp.category,
            date: new Date(exp.expense_date).toLocaleDateString()
          }))
        )
        setLoading(false)
      } catch (err) {
        console.error(err)
        alert('Error loading expenses.')
      }
    }

    if (session) fetchExpenses()
  }, [session])

  // ✅ Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (parseFloat(amount) <= 0) return

    const { data: sessionData } = await supabase.auth.getSession()
    const token = session?.access_token || sessionData?.session?.access_token

    if (!token) {
      alert("You're not signed in.")
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount), category, expense_date })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to add expense')
        return
      }

      setExpenses([
        {
          id: Date.now(),
          amount: parseFloat(amount).toFixed(2),
          category,
          date: new Date().toLocaleDateString()
        },
        ...expenses
      ])

      setAmount('0.00')
      setCategory('General')
    } catch (err) {
      console.error(err)
      alert('Error connecting to server')
    }
  }

  const totalExpenses = expenses.reduce((sum, ex) => sum + parseFloat(ex.amount), 0)
  const expenseCount = expenses.length

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>
      <p className="subtitle">Track and manage your expenses easily</p>

      <div className="tracker-container">
        <div className="add-expense-section">
          <h2>Add Expense</h2>
          <p>Enter amount and category</p>

          <form onSubmit={handleAddExpense}>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <button type="submit" className="add-button">Add Expense</button>
          </form>
        </div>

        <div className="summary-section">
          <h2>Total Expenses</h2>
          <p className="total-amount">{totalExpenses.toFixed(2)}</p>

          <h3>Expense Count</h3>
          <p>{expenseCount}</p>
        </div>
        
        <div className="expense-chart-wrapper">
          <ExpensePieChart expenses={expenses} />
        </div>

        <div className="ai-insights-wrapper">
            <AIInsights session={session} />
        </div>
        

        <div className="recent-expenses">
          <h2>Recent Expenses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="no-expenses">No expenses yet.</p>
          ) : (
            <ul className="expenses-list">
              {expenses.map((ex) => (
                <li key={ex.id} className="expense-item">
                  <span>{ex.category}</span>
                  <span>${ex.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseTracker
