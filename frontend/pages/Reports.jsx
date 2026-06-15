import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../services/api'

const COLORS = ['#1a5276', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#3498db']

export default function Reports() {
  const [report, setReport] = useState(null)
  const [period, setPeriod] = useState('weekly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/reports?period=${period}`)
      .then(res => setReport(res.data))
      .catch(() => {
        setReport({
          salesByDay: [
            { day: 'Isn', total: 42000 }, { day: 'Tal', total: 38000 },
            { day: 'Arb', total: 55000 }, { day: 'Kha', total: 48000 },
            { day: 'Jim', total: 72000 }, { day: 'Sab', total: 95000 }, { day: 'Axa', total: 135000 }
          ],
          topProducts: [
            { name: 'Baris', sales: 234 }, { name: 'Sonkor', sales: 189 },
            { name: 'Saliid', sales: 156 }, { name: 'Caano', sales: 143 }, { name: 'Hilib', sales: 98 }
          ],
          paymentBreakdown: [
            { name: 'Lacag Caddaan', value: 65 }, { name: 'Kaarka', value: 20 }, { name: 'Lacag Guursi', value: 15 }
          ],
          summary: { totalRevenue: 485000, totalSales: 87, avgSale: 5575, topCategory: 'Cuntada Aasaasiga' }
        })
      })
      .finally(() => setLoading(false))
  }, [period])

  if (loading) return <div style={styles.loading}>Soo raraya warbixinta...</div>

  return (
    <div>
      <div style={styles.topBar}>
        <h2 style={styles.title}>📈 Warbixinnada</h2>
        <div style={styles.periodBtns}>
          {['weekly', 'monthly', 'yearly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ ...styles.periodBtn, ...(period === p ? styles.activePeriod : {}) }}>
              {p === 'weekly' ? '7 Maalmood' : p === 'monthly' ? 'Bishaan' : 'Sanadkan'}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.summaryRow}>
        {[
          { label: 'Dakhliga Guud', value: `$${report?.summary?.totalRevenue?.toLocaleString()}`, icon: '💵' },
          { label: 'Wadarta Iibka', value: report?.summary?.totalSales, icon: '🧾' },
          { label: 'Celceliska Iibka', value: `$${report?.summary?.avgSale?.toLocaleString()}`, icon: '📊' },
          { label: 'Nooca Ugu Badan', value: report?.summary?.topCategory, icon: '🏆' },
        ].map((s, i) => (
          <div key={i} style={styles.summaryCard}>
            <div style={styles.summaryIcon}>{s.icon}</div>
            <div style={styles.summaryValue}>{s.value}</div>
            <div style={styles.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Iibka Maalinta</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={report?.salesByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `$${v.toLocaleString()}`} />
              <Bar dataKey="total" fill="#1a5276" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Qaabka Lacag Bixinta</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={report?.paymentBreakdown || []} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {report?.paymentBreakdown?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.chartBox}>
        <h3 style={styles.chartTitle}>🏆 Badeecadaha Ugu Badan Iibka</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={report?.topProducts || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="sales" fill="#2ecc71" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#2c3e50' },
  periodBtns: { display: 'flex', gap: '8px' },
  periodBtn: { padding: '8px 16px', background: '#fff', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#7f8c8d' },
  activePeriod: { background: '#1a5276', color: '#fff', border: '1.5px solid #1a5276' },
  loading: { textAlign: 'center', padding: '60px', color: '#7f8c8d' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' },
  summaryCard: { background: '#fff', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  summaryIcon: { fontSize: '28px', marginBottom: '8px' },
  summaryValue: { fontSize: '20px', fontWeight: '700', color: '#2c3e50', marginBottom: '4px' },
  summaryLabel: { fontSize: '12px', color: '#7f8c8d' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  chartBox: { background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' },
  chartTitle: { fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px' }
}
