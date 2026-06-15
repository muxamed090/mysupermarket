import React from 'react'

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products.length) {
    return <div style={styles.empty}>📦 Wax badeecad ah lama helin. Ku dar badeecad cusub.</div>
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Magaca</th>
            <th style={styles.th}>Nooca</th>
            <th style={styles.th}>Qiimaha</th>
            <th style={styles.th}>Kaydka</th>
            <th style={styles.th}>Xaaladda</th>
            <th style={styles.th}>Ficilada</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>
                <div style={styles.productName}>{p.name}</div>
                {p.barcode && <div style={styles.barcode}>{p.barcode}</div>}
              </td>
              <td style={styles.td}>{p.category?.name || '-'}</td>
              <td style={styles.td}><strong>${p.price?.toFixed(2)}</strong></td>
              <td style={styles.td}>{p.stock} {p.unit || 'kg'}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...(p.stock > 10 ? styles.inStock : styles.lowStock) }}>
                  {p.stock > 10 ? '✅ Waa jira' : '⚠️ Yar'}
                </span>
              </td>
              <td style={styles.td}>
                <button onClick={() => onEdit(p)} style={styles.editBtn}>✏️ Wax ka beddel</button>
                <button onClick={() => onDelete(p._id)} style={styles.deleteBtn}>🗑️ Tirtir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  wrapper: { overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
  headerRow: { background: '#1a5276' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '600' },
  rowEven: { background: '#fff' },
  rowOdd: { background: '#f8f9fa' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#2c3e50', borderBottom: '1px solid #f0f0f0' },
  productName: { fontWeight: '600', color: '#2c3e50' },
  barcode: { fontSize: '11px', color: '#95a5a6', marginTop: '2px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  inStock: { background: '#d5f5e3', color: '#1e8449' },
  lowStock: { background: '#fdecea', color: '#c0392b' },
  editBtn: {
    padding: '6px 12px', background: '#3498db', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px'
  },
  deleteBtn: {
    padding: '6px 12px', background: '#e74c3c', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
  },
  empty: {
    textAlign: 'center', padding: '60px', background: '#fff',
    borderRadius: '12px', color: '#7f8c8d', fontSize: '16px'
  }
}
