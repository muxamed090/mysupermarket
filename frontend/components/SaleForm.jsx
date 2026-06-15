import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function SaleForm({ onSave, onClose }) {
  const [items, setItems] = useState([{ product: '', quantity: 1, price: 0 }])
  const [products, setProducts] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(() => {})
  }, [])

  const addItem = () => setItems([...items, { product: '', quantity: 1, price: 0 }])
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))

  const updateItem = (i, field, val) => {
    const updated = [...items]
    updated[i][field] = val
    if (field === 'product') {
      const p = products.find(p => p._id === val)
      if (p) updated[i].price = p.price
    }
    setItems(updated)
  }

  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!items[0].product) return alert('Dooro ugu yaraan hal badeecad')
    setLoading(true)
    try {
      await api.post('/sales', { items, paymentMethod, customerName, totalAmount: total })
      onSave()
    } catch (err) {
      alert(err.response?.data?.message || 'Cilad ayaa dhacday')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>💰 Iib Cusub</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Magaca Macmiilka (ikhtiyaari)</label>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)}
              style={styles.input} placeholder="Macmiilka..." />
          </div>

          <div style={styles.itemsHeader}>
            <span style={styles.label}>Badeecadaha la iibiyo</span>
            <button type="button" onClick={addItem} style={styles.addItemBtn}>+ Kudar</button>
          </div>

          {items.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <select value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} style={{ ...styles.input, flex: 2 }}>
                <option value="">Dooro badeecad...</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} — ${p.price}</option>)}
              </select>
              <input type="number" min="1" value={item.quantity}
                onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                style={{ ...styles.input, width: '80px' }} />
              <span style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} style={styles.removeBtn}>✕</button>
              )}
            </div>
          ))}

          <div style={styles.totalBox}>
            <span>Wadarta Guud:</span>
            <span style={styles.totalAmount}>${total.toFixed(2)}</span>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Qaabka lacag bixinta</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={styles.input}>
              <option value="cash">💵 Lacag Caddaan</option>
              <option value="card">💳 Kaarka</option>
              <option value="mobile">📱 Lacag guursi</option>
            </select>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Ka noqo</button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? 'Sug...' : '✅ Xafidso Iibka'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '18px', fontWeight: '700', color: '#2c3e50' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7f8c8d' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none' },
  itemsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  addItemBtn: { background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  itemRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' },
  itemTotal: { fontWeight: '700', color: '#1a5276', minWidth: '70px', textAlign: 'right' },
  removeBtn: { background: '#fdecea', color: '#e74c3c', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' },
  totalBox: { display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#eaf4fb', borderRadius: '10px', marginBottom: '16px', fontWeight: '600', color: '#2c3e50' },
  totalAmount: { fontSize: '20px', fontWeight: '700', color: '#1a5276' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 24px', background: '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#2c3e50' },
  saveBtn: { padding: '10px 28px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
}
