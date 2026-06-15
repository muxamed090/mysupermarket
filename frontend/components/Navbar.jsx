import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.greeting}>Salaan, {user?.name || 'Maamule'} 👋</span>
      </div>
      <div style={styles.right}>
        <span style={styles.role}>{user?.role === 'admin' ? '🔑 Admin' : '👤 Cashierka'}</span>
        <button onClick={logout} style={styles.logoutBtn}>Ka Bax</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    height: '60px', background: '#fff', borderBottom: '1px solid #eee',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  left: {},
  greeting: { fontWeight: '600', color: '#2c3e50', fontSize: '15px' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  role: {
    background: '#eaf4fb', color: '#1a5276', borderRadius: '20px',
    padding: '4px 12px', fontSize: '13px', fontWeight: '600'
  },
  logoutBtn: {
    padding: '8px 16px', background: '#e74c3c', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
  }
}
