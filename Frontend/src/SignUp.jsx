import { useState } from 'react'

export default function SignUp({ onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg(data.error || 'Signup failed')
        return
      }

      setMsg('User created! You can now sign in.')
      onSignUp && onSignUp()

    } catch (err) {
      setMsg('Something went wrong: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
      <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Sign Up</button>
      {msg && <p>{msg}</p>}
    </form>
  )
}

