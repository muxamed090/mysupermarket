import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cashier' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch { setUsers([]) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users', form)
      setShowForm(false)
      setForm({ name: '', email: '', password: '', role: 'cashier' })
      fetchUsers()
    } catch (err) { alert(err.response?.data?.message || 'Cilad dhacday') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtireyso shaqaalahan?')) return
    try { await api.delete(`/users/${id}`); fetchUsers() }
    catch { alert('Tirtirka lama awoodi') }
  }

  const toggleActive = async (user) => {
    try { await api.put(`/users/${user._id}`, { isActive: !user.isActive }); fetchUsers() }
    catch { alert('Cilad dhacday') }
  }

  return (
    <div>
      <div style={styles.topBar}>
        <h2 style={styles.title}>👥 Maamulka Shaqaalaha</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? '✕ Xir' : '➕ Shaqaale Cusub'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Kudar Shaqaale Cusub</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {[
              { label: 'Magaca', name: 'name', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Password', name: 'password', type: 'password' },
            ].map(f => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label} *</label>
                <input type={f.type} value={form[f.name]} required
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })} style={styles.input} />
              </div>
            ))}
            <div style={styles.field}>
              <label style={styles.label}>Doorka *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={styles.input}>
                <option value="cashier">Cashierka</option>
                <option value="admin">Admin</option>
                <option value="manager">Maareeyaha</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Ka noqo</button>
              <button type="submit" style={styles.saveBtn}>Ku dar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Soo raraya...</div>
      ) : (
        <div style={styles.grid}>
          {users.map(u => (
            <div key={u._id} style={styles.userCard}>
              <div style={styles.avatar}>{u.name?.[0]?.toUpperCase() || '?'}</div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{u.name}</div>
                <div style={styles.userEmail}>{u.email}</div>
                <span style={{ ...styles.roleBadge, ...(u.role === 'admin' ? styles.adminBadge : styles.cashierBadge) }}>
                  {u.role === 'admin' ? '🔑 Admin' : u.role === 'manager' ? '📋 Maareeyaha' : '👤 Cashierka'}
                </span>
              </div>
              <div style={styles.userActions}>
                <button onClick={() => toggleActive(u)}
                  style={{ ...styles.actionBtn, background: u.isActive !== false ? '#d5f5e3' : '#fdecea' }}>
                  {u.isActive !== false ? '✅ Firfircoon' : '❌ Joojiyey'}
                </button>
                <button onClick={() => handleDelete(u._id)} style={styles.deleteBtn}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#2c3e50' },
  addBtn: { padding: '10px 20px', background: '#1a5276', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  formCard: { background: '#fff', borderRadius: '14px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '700', color: '#2c3e50', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none' },
  cancelBtn: { padding: '10px 24px', background: '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#2c3e50' },
  saveBtn: { padding: '10px 28px', background: '#1a5276', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  loading: { textAlign: 'center', padding: '60px', color: '#7f8c8d' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  userCard: { background: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  avatar: { width: '48px', height: '48px', background: '#1a5276', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: '700', flexShrink: 0 },
  userInfo: { flex: 1 },
  userName: { fontWeight: '700', color: '#2c3e50', fontSize: '15px' },
  userEmail: { fontSize: '13px', color: '#7f8c8d', marginBottom: '6px' },
  roleBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  adminBadge: { background: '#fef9e7', color: '#d4ac0d' },
  cashierBadge: { background: '#eaf4fb', color: '#1a5276' },
  userActions: { display: 'flex', flexDirection: 'column', gap: '6px' },
  actionBtn: { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  deleteBtn: { padding: '6px 12px', background: '#fdecea', color: '#e74c3c', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
}
