// src/App.jsx
import { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

function App() {
  const [session, setSession] = useState(null)
const [mode, setMode] = useState('signin') // or 'signup'

  if (session) {
    return <p>Welcome! You're signed in 🎉</p>
  }

  return (
    <div>
      {mode === 'signin' ? (
        <>
          <SignIn onSignIn={setSession} />
          <p>
            Don't have an account?{' '}
            <button onClick={() => setMode('signup')}>Sign up</button>
          </p>
        </>
      ) : (
        <>
          <SignUp onSignUp={() => setMode('signin')} />
          <p>
            Already have an account?{' '}
            <button onClick={() => setMode('signin')}>Sign in</button>
          </p>
        </>
      )}
    </div>
  )
}

export default App
