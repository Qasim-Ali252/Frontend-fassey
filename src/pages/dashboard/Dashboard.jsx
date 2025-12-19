import "../../styles/dashboard.css";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

// Fallback data in case API fails
const fallbackStats = [
  { label: "Total Orders", value: 1240 },
  { label: "Total Sales", value: "$42,300" },
  { label: "Products", value: 320 },
  { label: "Low Stock", value: 18 },
];

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useAdminDashboard();

  // Transform API data to match our component structure
  const overview = dashboardData?.overview;
  
  const stats = overview ? [
    { label: "Total Products Sold", value: overview.totalProductsSold },
    { label: "Total Revenue", value: `$${overview.totalRevenue}` },
    { label: "Products Sold Today", value: overview.productSoldToday },
    { label: "Revenue Today", value: `$${overview.revenueToday}` },
  ] : fallbackStats;

  // For now, we don't have recent orders in the API response, so use fallback
  const recentOrders = [];
  
  // Use top5LowStock as our "top products" section for now
  const lowStockProducts = overview?.top5LowStock || [];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error loading dashboard</h3>
          <p>{error.message}</p>
          <p>Showing fallback data instead.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="stats-grid">
        {stats.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="grid-2">
        <div className="card">
          <h3>Critical Low Stock Alert</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {overview?.lowStock?.length > 0 ? (
                overview.lowStock.map((item) => (
                  <tr key={item.variant_id}>
                    <td>{item.product.name}</td>
                    <td>{item.sku}</td>
                    <td>{item.stock}</td>
                    <td>
                      <span style={{ 
                        color: item.stock <= 2 ? '#d32f2f' : '#f57c00',
                        fontWeight: '600'
                      }}>
                        {item.stock <= 2 ? 'Critical' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>
                    No low stock items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Top 5 Low Stock Products</h3>
          <ul className="simple-list">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product, index) => (
                <li key={product.variant_id || index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{product.name}</span>
                    <span style={{ 
                      color: product.stock <= 2 ? '#d32f2f' : '#f57c00',
                      fontWeight: '600'
                    }}>
                      {product.stock} left
                    </span>
                  </div>
                </li>
              ))
            ) : (
              // Fallback hardcoded data
              <>
                <li>Blue Slim Fit Jeans — 120 sold</li>
                <li>Black Slim Fit-Chinos — 87 sold</li>
                <li>Skin Regular Fit-Chinos — 65 sold</li>
              </>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
