import React, { useMemo } from 'react'
import { getOrders, getChefs, getTables } from '../utils/storage'

function StatCard({ title, value, small }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {small && <div className="stat-small">{small}</div>}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const orders = getOrders()
  const chefs = getChefs()
  const tables = getTables()

  const totalRevenue = useMemo(
    () => orders.reduce((s, o) => s + (o.amount || 0), 0),
    [orders]
  )
  const totalOrders = orders.length
  const totalClients = useMemo(() => {
    // In SRD: unique clients by phone — we don't have phone fields in sample orders.
    // For demo, return unique chefIds (placeholder). Replace with proper unique phone calculation when orders include phone.
    const unique = new Set(orders.map(o => o.table ? `table-${o.table}` : `takeaway-${o.id}`))
    return unique.size
  }, [orders])

  const ordersSummary = useMemo(() => {
    const served = orders.filter(o => o.status.toLowerCase() === 'served' || o.status.toLowerCase() === 'done').length
    const dineIn = orders.filter(o => o.type === 'Dine In').length
    const takeaway = orders.filter(o => o.type === 'Takeaway').length
    return { served, dineIn, takeaway }
  }, [orders])

  const reservedTables = tables.filter(t => t.reserved).length

  return (
    <div className="analytics-root">
      <h2 className="page-title">Analytics</h2>

      <div className="stats-row">
        <StatCard title="Chefs" value={chefs.length} />
        <StatCard title="Total Revenue" value={`₹ ${totalRevenue}`} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Total Clients" value={totalClients} />
      </div>

      <section className="panel">
        <h3 className="panel-title">Orders Summary</h3>
        <div className="orders-summary">
          <div className="summary-left">
            <div className="summary-stats">
              <div className="summary-item">
                <div className="summary-label">Served</div>
                <div className="summary-value">{ordersSummary.served}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Dine In</div>
                <div className="summary-value">{ordersSummary.dineIn}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Takeaway</div>
                <div className="summary-value">{ordersSummary.takeaway}</div>
              </div>
            </div>
          </div>

          <div className="summary-right">
            <div className="chart-placeholder">
              <div className="chart-text">Revenue / Graph (select Daily / Weekly)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel small">
        <h3 className="panel-title">Tables</h3>
        <div className="tables-grid">
          {tables.map(t => (
            <div key={t.id} className={`table-card ${t.reserved ? 'reserved' : ''}`}>
              <div className="table-top">
                <div className="table-number">Table {t.id}</div>
                <div className="table-seats">{t.seats} seats</div>
              </div>
              <div className="table-name">{t.name || '—'}</div>
            </div>
          ))}
        </div>
        <div className="tables-footer">
          Reserved: <strong>{reservedTables}</strong> / {tables.length}
        </div>
      </section>
    </div>
  )
}
