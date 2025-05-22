const express = require('express')
const cors = require('cors')
const { supabase } = require('./supabaseClient')
const { authenticateUser } = require('./authMiddleware')
require('dotenv').config()

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// SIGNUP Route
app.post('/signup', async (req, res) => {
    const { email, password, first_name, last_name } = req.body
  
    // 1. Create user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true  // Skip confirmation step
    })
  
    if (signUpError) {
      return res.status(400).json({ error: signUpError.message })
    }
  
    const userId = authData.user.id
  
    // 2. Insert user into custom 'users' table
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      first_name,
      last_name
    })
  
    if (insertError) {
      return res.status(500).json({ error: insertError.message })
    }
  
    return res.status(201).json({ message: 'User created successfully', user_id: userId })
  })


app.post('/expenses', authenticateUser, async (req, res) => {
  const user_id = req.user?.id // From the auth middleware

  const { amount, category, expense_date } = req.body

  if (!amount || !category || !expense_date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { data, error } = await supabase.from('expenses').insert([
    { user_id, amount, category, expense_date }
  ])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({ message: 'Expense added', data })
})


// GET /expenses - Get all expenses for the authenticated user
app.get('/expenses', authenticateUser, async (req, res) => {
  const user_id = req.user.id

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user_id)
    .order('expense_date', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
