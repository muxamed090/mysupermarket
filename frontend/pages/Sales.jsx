import React, { useEffect, useState } from 'react'
import SaleForm from '../components/SaleForm'
import api from '../services/api'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => { fetchSales() }, [dateFilter])

  const fetchSales = async () => {
    try {
      const params = dateFilter ? { date: dateFilter } : {}
      const res = await api.get('/sales', { params })
      setSales(res.data)
    } catch {
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0)

  const paymentIcon = { cash: '💵', card: '💳', mobile: '📱' }

  return (
    <div>
      <div style={styles.topBar}>
        <h2 style={styles.title}>💰 Iibka</h2>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>➕ Iib Cusub</button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{sales.length}</div>
          <div style={styles.statLabel}>Iibka Maanta</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#2ecc71' }}>${totalRevenue.toFixed(2)}</div>
          <div style={styles.statLabel}>Wadarta Dakhliga</div>
        </div>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Shaandheyn Taariikhda:</label>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={styles.dateInput} />
          {dateFilter && <button onClick={() => setDateFilter('')} style={styles.clearBtn}>Tirtir</button>}
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Soo raraya iibka...</div>
      ) : sales.length === 0 ? (
        <div style={styles.empty}>🧾 Iib ma jiro maalintan</div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Lambarka</span>
            <span>Macmiilka</span>
            <span>Badeecadaha</span>
            <span>Wadarta</span>
            <span>Qaabka</span>
            <span>Taariikhda</span>
          </div>
          {sales.map((sale, i) => (
            <div key={sale._id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <span style={styles.saleNum}>#{String(i + 1).padStart(4, '0')}</span>
              <span>{sale.customerName || 'Macmiil aan la garanin'}</span>
              <span>{sale.items?.length || 0} badeecad</span>
              <span style={styles.amount}>${sale.totalAmount?.toFixed(2)}</span>
              <span>{paymentIcon[sale.paymentMethod]} {sale.paymentMethod}</span>
              <span style={styles.date}>{new Date(sale.createdAt).toLocaleDateString('so-SO')}</span>
            </div>
          ))}
        </div>
      )}

      {showForm && <SaleForm onSave={() => { setShowForm(false); fetchSales() }} onClose={() => setShowForm(false)} />}
    </div>
  )
}

const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#2c3e50' },
  addBtn: { padding: '10px 20px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '20px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: '150px' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#2c3e50' },
  statLabel: { fontSize: '13px', color: '#7f8c8d', marginTop: '4px' },
  filterCard: { background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  filterLabel: { fontSize: '13px', fontWeight: '600', color: '#2c3e50', whiteSpace: 'nowrap' },
  dateInput: { padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px' },
  clearBtn: { padding: '7px 14px', background: '#fdecea', color: '#e74c3c', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  loading: { textAlign: 'center', padding: '60px', color: '#7f8c8d' },
  empty: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', color: '#7f8c8d', fontSize: '16px' },
  table: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr', padding: '14px 20px', background: '#1a5276', color: '#fff', fontWeight: '600', fontSize: '13px' },
  rowEven: { display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr', padding: '14px 20px', fontSize: '14px', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', background: '#fff', alignItems: 'center' },
  rowOdd: { display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr', padding: '14px 20px', fontSize: '14px', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', background: '#f8f9fa', alignItems: 'center' },
  saleNum: { fontWeight: '700', color: '#1a5276' },
  amount: { fontWeight: '700', color: '#2ecc71' },
  date: { color: '#7f8c8d', fontSize: '13px' }
}
