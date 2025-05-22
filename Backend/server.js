const express = require('express')
const cors = require('cors')
const { supabase } = require('./supabaseClient')
const { authenticateUser } = require('./authMiddleware')
require('dotenv').config()

const app = express()
app.use(cors())
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
    const user_id = req.user.id
    const { amount, category, description, payment_method, expense_date } = req.body
  
    const { data, error } = await supabaseAdmin.from('expenses').insert([
      { user_id, amount, category, description, payment_method, expense_date }
    ])
  
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ message: 'Expense added', data })
  })
  
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


