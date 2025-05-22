// authMiddleware.js
const { supabaseAuth } = require('./supabaseClient')

async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1] // Bearer <token>
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = user
  next()
}

module.exports = { authenticateUser }
