import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', price: '', stock: '', unit: 'kg',
    barcode: '', category: '', supplier: '', description: ''
  })
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) setForm({ ...product, category: product.category?._id || '', supplier: product.supplier?._id || '' })
    fetchOptions()
  }, [product])

  const fetchOptions = async () => {
    try {
      const [catRes, supRes] = await Promise.all([api.get('/categories'), api.get('/suppliers')])
      setCategories(catRes.data)
      setSuppliers(supRes.data)
    } catch {}
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Nadiifi xogta: tirso goobaha madhan ee ikhtiyaariga ah
      const payload = {
        name:        form.name.trim(),
        price:       Number(form.price),
        stock:       Number(form.stock),
        unit:        form.unit,
        description: form.description?.trim() || undefined,
        barcode:     form.barcode?.trim() || undefined,
        category:    form.category  || undefined,
        supplier:    form.supplier  || undefined,
      }

      // Xaqiiji in magaca iyo qiimaha jiraan
      if (!payload.name)         throw new Error('Magaca badeecadda geli')
      if (isNaN(payload.price) || payload.price < 0) throw new Error('Qiimaha saxda ah geli')
      if (isNaN(payload.stock)  || payload.stock < 0) throw new Error('Kaydka saxda ah geli')

      if (product) {
        await api.put(`/products/${product._id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      onSave()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Cilad ayaa dhacday')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>{product ? '✏️ Wax ka beddel Badeecadda' : '➕ Ku dar Badeecad Cusub'}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <Field label="Magaca Badeecadda *" name="name" value={form.name} onChange={handleChange} required />
            <Field label="Qiimaha ($) *" name="price" type="number" value={form.price} onChange={handleChange} required />
            <Field label="Kaydka *" name="stock" type="number" value={form.stock} onChange={handleChange} required />
            <div style={styles.field}>
              <label style={styles.label}>Cutubka</label>
              <select name="unit" value={form.unit} onChange={handleChange} style={styles.input}>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">Litre</option>
                <option value="piece">Qayb</option>
                <option value="box">Sanduuq</option>
              </select>
            </div>
            <Field label="Barcode" name="barcode" value={form.barcode} onChange={handleChange} />
            <div style={styles.field}>
              <label style={styles.label}>Nooca</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                <option value="">Dooro nooca</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Alaab keenaha</label>
              <select name="supplier" value={form.supplier} onChange={handleChange} style={styles.input}>
                <option value="">Dooro keenaha</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Faahfaahinta</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: '80px', resize: 'vertical' }} />
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Ka noqo</button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? 'Sug...' : (product ? 'Xafidso' : 'Ku dar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Field = ({ label, name, type = 'text', value, onChange, required }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} style={styles.input} />
  </div>
)

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: '16px', padding: '32px',
    width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '18px', fontWeight: '700', color: '#2c3e50' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7f8c8d' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: {
    padding: '10px 24px', background: '#ecf0f1', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#2c3e50'
  },
  saveBtn: {
    padding: '10px 28px', background: '#1a5276', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  }
}