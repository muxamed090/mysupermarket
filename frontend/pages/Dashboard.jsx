import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, products: 0, sales: 0, lowStock: 0 })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reports/dashboard')
        setStats(res.data.stats || {})
        setChartData(res.data.chartData || [])
      } catch {
        // Demo data haddii backend la waayo
        setStats({ revenue: 485000, products: 234, sales: 87, lowStock: 12 })
        setChartData([
          { name: 'Isniin', iib: 42000 }, { name: 'Talaado', iib: 38000 },
          { name: 'Arbaco', iib: 55000 }, { name: 'Khamis', iib: 48000 },
          { name: 'Jimce', iib: 72000 }, { name: 'Sabti', iib: 95000 },
          { name: 'Axad', iib: 135000 }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cards = [
    { label: 'Dakhliga Maanta', value: `$${stats.revenue?.toLocaleString()}`, icon: '💵', color: '#2ecc71' },
    { label: 'Badeecadaha', value: stats.products, icon: '📦', color: '#3498db' },
    { label: 'Iibka Maanta', value: stats.sales, icon: '🧾', color: '#9b59b6' },
    { label: 'Khatar Yar', value: stats.lowStock, icon: '⚠️', color: '#e74c3c' },
  ]

  if (loading) return <div style={styles.loading}>Soo raraya...</div>

  return (
    <div>
      <h2 style={styles.title}>Dashboard</h2>

      <div style={styles.cards}>
        {cards.map((c, i) => (
          <div key={i} style={styles.card}>
            <div style={{ ...styles.cardIcon, background: c.color + '20', color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div style={styles.cardValue}>{c.value}</div>
              <div style={styles.cardLabel}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chartBox}>
        <h3 style={styles.chartTitle}>📈 Iibka 7ta Maalmood ee Dambe</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => `$${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="iib" stroke="#1a5276" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const styles = {
  title: { fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginBottom: '24px' },
  loading: { display: 'flex', justifyContent: 'center', padding: '80px', color: '#7f8c8d', fontSize: '18px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' },
  card: {
    background: '#fff', borderRadius: '14px', padding: '24px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  cardIcon: { fontSize: '28px', borderRadius: '12px', padding: '14px', lineHeight: 1 },
  cardValue: { fontSize: '24px', fontWeight: '700', color: '#2c3e50' },
  cardLabel: { fontSize: '13px', color: '#7f8c8d', marginTop: '2px' },
  chartBox: {
    background: '#fff', borderRadius: '14px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  chartTitle: { fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }
}
