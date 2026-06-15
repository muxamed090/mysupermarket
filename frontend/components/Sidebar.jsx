import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/products', icon: '📦', label: 'Badeecadaha' },
  { path: '/sales', icon: '💰', label: 'Iibka' },
  { path: '/reports', icon: '📈', label: 'Warbixinnada' },
  { path: '/users', icon: '👥', label: 'Shaqaalaha', adminOnly: true },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🛒</span>
        <span style={styles.logoText}>MySupermarket</span>
      </div>
      <nav style={styles.nav}>
        {menuItems
          .filter(item => !item.adminOnly || user?.role === 'admin')
          .map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {})
              })}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>
      <div style={styles.footer}>
        <span style={styles.version}>v1.0.0</span>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px', minHeight: '100vh', background: '#1a5276',
    display: 'flex', flexDirection: 'column', color: '#fff'
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logoIcon: { fontSize: '28px' },
  logoText: { fontWeight: '700', fontSize: '16px' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  link: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
    borderRadius: '10px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
    fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
  },
  activeLink: {
    background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: '700'
  },
  icon: { fontSize: '18px', width: '24px', textAlign: 'center' },
  footer: { padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  version: { fontSize: '12px', color: 'rgba(255,255,255,0.4)' }
}
