import React, { useEffect, useState } from 'react'
import ProductTable from '../components/ProductTable'
import ProductForm from '../components/ProductForm'
import api from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    setFiltered(products.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search)
    ))
  }, [search, products])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
      setFiltered(res.data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => { setEditProduct(product); setShowForm(true) }
  const handleAdd = () => { setEditProduct(null); setShowForm(true) }
  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtireyso badeecaddan?')) return
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch { alert('Tirtirka lama awoodi') }
  }
  const handleSave = () => { setShowForm(false); fetchProducts() }

  return (
    <div>
      <div style={styles.topBar}>
        <h2 style={styles.title}>📦 Maamulka Badeecadaha</h2>
        <button onClick={handleAdd} style={styles.addBtn}>➕ Badeecad Cusub</button>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Raadi magaca ama barcode..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.count}>{filtered.length} badeecad</span>
      </div>

      {loading ? (
        <div style={styles.loading}>Soo raraya badeecadaha...</div>
      ) : (
        <ProductTable products={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {showForm && (
        <ProductForm product={editProduct} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#2c3e50' },
  addBtn: {
    padding: '10px 20px', background: '#1a5276', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px',
    background: '#fff', padding: '12px 16px', borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#2c3e50' },
  count: { color: '#7f8c8d', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
  loading: { textAlign: 'center', padding: '60px', color: '#7f8c8d' }
}
