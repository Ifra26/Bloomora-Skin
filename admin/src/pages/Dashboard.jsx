import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending: '#B9822F',
  processing: '#33578C',
  shipped: '#5B3F9E',
  delivered: '#2E6B31',
  cancelled: '#A6402F'
};

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats', token).then(setStats);
  }, [token]);

  if (!stats) return <p>Loading dashboard…</p>;

  const statusData = Object.entries(stats.statusCounts).map(([status, value]) => ({
    name: status,
    value,
    color: STATUS_COLORS[status] || '#999'
  }));

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <div className="stat-grid">
        <div className="card stat-card">
          <p className="stat-label">Revenue</p>
          <p className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</p>
          <p className="stat-sub">Excludes cancelled orders</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Orders</p>
          <p className="stat-value">{stats.totalOrders}</p>
          <p className="stat-sub">{stats.statusCounts.pending || 0} pending</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Products</p>
          <p className="stat-value">{stats.totalProducts}</p>
          <p className="stat-sub">{stats.lowStock} low on stock</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Customers</p>
          <p className="stat-value">{stats.totalCustomers}</p>
          <p className="stat-sub">Registered accounts</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card dash-card">
          <h3>Recent orders</h3>
          {stats.recentOrders.length === 0 ? (
            <p className="empty-cell">No orders yet.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="mono">#{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td>Rs. {o.total.toLocaleString()}</td>
                    <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link to="/orders" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>View all orders</Link>
        </div>

        <div className="card dash-card">
          <h3>Orders by status</h3>
          {statusData.length === 0 ? (
            <p className="empty-cell">No data yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 10 }}>
                {statusData.map((s) => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '4px 0' }}>
                    <span style={{ textTransform: 'capitalize' }}>{s.name}</span>
                    <span>{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 style={{ marginTop: 24 }}>Top products</h3>
          {stats.topProducts.length === 0 ? (
            <p className="empty-cell">No sales yet.</p>
          ) : (
            stats.topProducts.map((p) => (
              <div key={p.name} className="top-product-row">
                <span>{p.name}</span>
                <span className="mono">{p.qty} sold</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
