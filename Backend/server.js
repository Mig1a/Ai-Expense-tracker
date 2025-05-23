const express = require('express')
const cors = require('cors')
const { supabase } = require('./supabaseClient')
const { authenticateUser } = require('./authMiddleware')
const { OpenAI } = require("openai");
require('dotenv').config()

const app = express()
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-expense-tracker-gbjn.vercel.app",
  "https://ai-expense-tracker-gbjn-igxrj0we1-million-aboyes-projects.vercel.app"
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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


app.get("/insights", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const range = req.query.range || "yearly";

  const now = new Date();
  let startDate;

  // Determine the start date based on requested range
  let sinceDate = new Date()
  if (range === "weekly") sinceDate.setDate(sinceDate.getDate() - 7)
  else if (range === "monthly") sinceDate.setMonth(sinceDate.getMonth() - 1)
  else sinceDate.setFullYear(sinceDate.getFullYear() - 1)

  // Fetch expenses filtered by user and date
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .gte("expense_date", sinceDate.toISOString().split("T")[0]);


  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!expenses || expenses.length === 0) {
    return res.status(404).json({ message: `No ${range} expenses found to analyze.` });
  }

  // Create prompt for OpenAI
  const prompt = `You're a smart, friendly financial assistant. Review the user's ${range} expenses below and offer 2–3 thoughtful, helpful financial insights.

  Avoid repeating the raw data — focus on patterns, habits, or areas where the user might want to improve or pay attention. Write in a simple, conversational tone.

  , Write plain-language insights in paragraph form, not as numbered breakdowns or lists of percentages. Here are the expenses:
  ${JSON.stringify(expenses, null, 2)}
  "Don't use markdown symbols like ** or ###."`;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const insights = response.choices[0].message.content.trim();
    return res.status(200).json({ insights });

  } catch (err) {
    console.error("OpenAI error:", err.message);
    return res.status(500).json({ error: "Failed to generate AI insights." });
  }
});


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
