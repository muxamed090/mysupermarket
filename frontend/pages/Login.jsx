import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Fadlan email iyo password saxda ah geli')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🛒</div>
        <h1 style={styles.title}>MySupermarket</h1>
        <p style={styles.subtitle}>Maamulka Dukaanka</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              placeholder="admin@supermarket.so"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sug...' : 'Gal'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'linear-gradient(135deg, #1a5276 0%, #2ecc71 100%)'
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '48px 40px',
    width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  logo: { fontSize: '48px', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a5276', marginBottom: '4px' },
  subtitle: { color: '#7f8c8d', marginBottom: '32px', fontSize: '14px' },
  error: {
    background: '#fdecea', color: '#e74c3c', borderRadius: '8px',
    padding: '12px', marginBottom: '16px', fontSize: '14px'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' },
  label: { fontSize: '14px', fontWeight: '600', color: '#2c3e50' },
  input: {
    padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #ddd',
    fontSize: '15px', outline: 'none', transition: 'border 0.2s'
  },
  button: {
    padding: '14px', background: '#1a5276', color: '#fff', border: 'none',
    borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    marginTop: '8px', transition: 'background 0.2s'
  }
}
