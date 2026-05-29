import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/')
  }

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div className="login-wrap">
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">📊</div>
          <span className="brand-name">Budsjett</span>
        </div>

        <div className="login-body">
          <h1>Logg inn</h1>
          <p>Fortsett der du slapp.</p>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>E-post</label>
              <input type="email" placeholder="deg@eksempel.no"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <div className="field-row">
                <label>Passord</label>
                <a href="#" className="forgot">Glemt passord?</a>
              </div>
              <input type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary">Logg inn</button>
          </form>

          <p className="register-row">
            Ny bruker? <span onClick={handleRegister} style={{cursor:'pointer'}}>Opprett konto</span>
          </p>
        </div>
        <div />
      </div>

      <div className="login-right">
        <div className="stat-pill">
          <div className="s-label">Saldo denne måneden</div>
          <div className="s-value">4 250 kr</div>
          <div className="s-sub">Logg inn for å se ditt</div>
        </div>
        <div className="stat-pill">
          <div className="s-label">Hold styr på</div>
          <div className="s-value">Inntekter</div>
          <div className="s-sub">og utgifter</div>
        </div>
        <div className="stat-pill">
          <div className="s-label">Sparemål</div>
          <div className="s-value">Nå dem</div>
          <div className="s-sub">måned for måned</div>
        </div>
      </div>
    </div>
  )
}